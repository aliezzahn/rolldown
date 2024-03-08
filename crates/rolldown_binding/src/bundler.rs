use napi::Env;
use napi_derive::napi;
use rolldown::Bundler as NativeBundler;
use rolldown_fs::OsFileSystem;
use tracing::instrument;

use crate::{
  options::{BindingInputOptions, BindingOutputOptions},
  types::binding_outputs::BindingOutputs,
  utils::{normalize_binding_options::normalize_binding_options, try_init_custom_trace_subscriber},
};

#[napi]
pub struct Bundler {
  inner: NativeBundler<OsFileSystem>,
}

#[napi]
impl Bundler {
  #[napi(constructor)]
  pub fn new(
    env: Env,
    input_options: BindingInputOptions,
    output_options: BindingOutputOptions,
  ) -> napi::Result<Self> {
    try_init_custom_trace_subscriber(env);
    let ret = normalize_binding_options(input_options, output_options)?;

    Ok(Self {
      inner: NativeBundler::with_plugins(ret.input_options, ret.output_options, ret.plugins),
    })
  }

  #[napi]
  pub async unsafe fn write(&mut self) -> napi::Result<BindingOutputs> {
    self.write_impl().await
  }

  #[napi]
  pub async unsafe fn generate(&mut self) -> napi::Result<BindingOutputs> {
    self.generate_impl().await
  }

  #[napi]
  pub async unsafe fn scan(&mut self) -> napi::Result<()> {
    self.scan_impl().await
  }
}

impl Bundler {
  #[instrument(skip_all)]
  #[allow(clippy::significant_drop_tightening)]
  pub async fn scan_impl(&mut self) -> napi::Result<()> {
    let result = self.inner.scan().await;

    if let Err(err) = result {
      // TODO: better handing errors
      eprintln!("{err:?}");
      return Err(napi::Error::from_reason("Build failed"));
    }

    Ok(())
  }

  #[instrument(skip_all)]
  #[allow(clippy::significant_drop_tightening)]
  pub async fn write_impl(&mut self) -> napi::Result<BindingOutputs> {
    let maybe_outputs = self.inner.write().await;

    let outputs = match maybe_outputs {
      Ok(outputs) => outputs,
      Err(err) => {
        // TODO: better handing errors
        eprintln!("{err:?}");
        return Err(napi::Error::from_reason("Build failed"));
      }
    };

    Ok(outputs.assets.into())
  }

  #[instrument(skip_all)]
  #[allow(clippy::significant_drop_tightening)]
  pub async fn generate_impl(&mut self) -> napi::Result<BindingOutputs> {
    let maybe_outputs = self.inner.generate().await;

    let outputs = match maybe_outputs {
      Ok(outputs) => outputs,
      Err(err) => {
        // TODO: better handing errors
        eprintln!("{err:?}");
        return Err(napi::Error::from_reason("Build failed"));
      }
    };

    Ok(outputs.assets.into())
  }
}
