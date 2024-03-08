import {
  instantiateNapiModuleSync as __emnapiInstantiateNapiModuleSync,
  getDefaultContext as __emnapiGetDefaultContext,
  WASI as __WASI,
} from '@napi-rs/wasm-runtime'
import { Volume as __Volume, createFsFromVolume as __createFsFromVolume } from '@napi-rs/wasm-runtime/fs'

import __wasmUrl from './rolldown-binding.wasm32-wasi.wasm?url'

const __fs = __createFsFromVolume(
  __Volume.fromJSON({
    '/': null,
  }),
)

const __wasi = new __WASI({
  version: 'preview1',
  fs: __fs,
})

const __emnapiContext = __emnapiGetDefaultContext()

const __sharedMemory = new WebAssembly.Memory({
  initial: 1024,
  maximum: 10240,
  shared: true,
})

const __wasmFile = await fetch(__wasmUrl).then((res) => res.arrayBuffer())

const {
  instance: __napiInstance,
  module: __wasiModule,
  napiModule: __napiModule,
} = __emnapiInstantiateNapiModuleSync(__wasmFile, {
  context: __emnapiContext,
  asyncWorkPoolSize: 4,
  wasi: __wasi,
  onCreateWorker() {
    return new Worker(new URL('./wasi-worker-browser.mjs', import.meta.url), {
      type: 'module',
    })
  },
  overwriteImports(importObject) {
    importObject.env = {
      ...importObject.env,
      ...importObject.napi,
      ...importObject.emnapi,
      memory: __sharedMemory,
    }
    return importObject
  },
  beforeInit({ instance }) {
    __napi_rs_initialize_modules(instance)
  },
})

function __napi_rs_initialize_modules(__napiInstance) {
  __napiInstance.exports['__napi_register__Bundler_struct_0']?.()
  __napiInstance.exports['__napi_register__Bundler_impl_5']?.()
  __napiInstance.exports['__napi_register__BindingInputItem_struct_6']?.()
  __napiInstance.exports['__napi_register__BindingResolveOptions_struct_7']?.()
  __napiInstance.exports['__napi_register__BindingInputOptions_struct_8']?.()
  __napiInstance.exports['__napi_register__BindingOutputOptions_struct_9']?.()
  __napiInstance.exports['__napi_register__PluginOptions_struct_10']?.()
  __napiInstance.exports['__napi_register__HookResolveIdArgsOptions_struct_11']?.()
  __napiInstance.exports['__napi_register__ResolveIdResult_struct_12']?.()
  __napiInstance.exports['__napi_register__SourceResult_struct_13']?.()
  __napiInstance.exports['__napi_register__HookRenderChunkOutput_struct_14']?.()
  __napiInstance.exports['__napi_register__PreRenderedChunk_struct_15']?.()
  __napiInstance.exports['__napi_register__RenderedChunk_struct_16']?.()
  __napiInstance.exports['__napi_register__BindingOutputAsset_struct_17']?.()
  __napiInstance.exports['__napi_register__BindingOutputChunk_struct_18']?.()
  __napiInstance.exports['__napi_register__BindingOutputs_struct_19']?.()
  __napiInstance.exports['__napi_register__BindingRenderedModule_struct_20']?.()
}
export const Bundler = __napiModule.exports.Bundler
