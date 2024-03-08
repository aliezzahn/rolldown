fn main() {
  napi_build::setup();

  if let Ok("wasi") = std::env::var("CARGO_CFG_TARGET_OS").as_deref() {
    println!("cargo:rustc-link-arg=-zstack-size=0x3200000");
    println!("cargo:rustc-link-arg=--max-memory=4294967296");
  }
}
