use std::{fmt::Debug, marker::PhantomData};

use napi::{
  bindgen_prelude::{FromNapiValue, Promise, ValidateNapiValue},
  threadsafe_function::{ErrorStrategy, ThreadsafeFunction},
  Either,
};

use super::IntoJsUnknownVec;

pub trait JsCallbackArgs: IntoJsUnknownVec + Send + Sync + 'static {}
impl<T: IntoJsUnknownVec + Send + Sync + 'static> JsCallbackArgs for T {}
pub trait JsCallbackRet: FromNapiValue + ValidateNapiValue + Send + 'static {}
impl<T: FromNapiValue + ValidateNapiValue + Send + 'static> JsCallbackRet for T {}

pub struct JsCallback<Args: JsCallbackArgs, Ret: JsCallbackRet> {
  _ret: PhantomData<Ret>,
  tsfn: ThreadsafeFunction<Args, ErrorStrategy::Fatal>,
}

impl<Args: JsCallbackArgs + Debug, Ret: JsCallbackRet> JsCallback<Args, Ret> {
  pub fn new(tsfn: &ThreadsafeFunction<Args, ErrorStrategy::Fatal>) -> napi::Result<Self> {
    Ok(Self { _ret: PhantomData, tsfn: tsfn.clone() })
  }

  /// This method is already handle case return Promise<Ret>
  #[allow(clippy::future_not_send)]
  pub(crate) async fn call_async(&self, args: Args) -> napi::Result<Ret> {
    let ret: Either<Ret, Promise<Ret>> = self.tsfn.call_async(args).await?;

    match ret {
      Either::A(ret) => Ok(ret),
      Either::B(promise) => promise.await,
    }
  }
}

impl<Args: JsCallbackArgs, Ret: JsCallbackRet> Clone for JsCallback<Args, Ret> {
  fn clone(&self) -> Self {
    Self { _ret: PhantomData, tsfn: self.tsfn.clone() }
  }
}
