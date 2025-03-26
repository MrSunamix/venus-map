#[cfg(target_os = "windows")]
fn main() {
    let mut windows = tauri_build::WindowsAttributes::new();

    windows = windows.app_manifest(
        r#"
        <assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
        <dependency>
            <dependentAssembly>
            <assemblyIdentity
                type="win32"
                name="Microsoft.Windows.Common-Controls"
                version="6.0.0.0"
                processorArchitecture="*"
                publicKeyToken="6595b64144ccf1df"
                language="*"
            />
            </dependentAssembly>
        </dependency>
        <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
            <asmv3:windowsSettings xmlns="http://schemas.microsoft.com/SMI/2024/WindowsSettings">
                <supportedArchitectures>amd64 arm64</supportedArchitectures>
            </asmv3:windowsSettings>
            <security>
                <requestedPrivileges xmlns="urn:schemas-microsoft-com:asm.v3">
                    <requestedExecutionLevel level="requireAdministrator" uiAccess="false" />
                </requestedPrivileges>
            </security>
        </trustInfo>
        </assembly>
        "#,
    );

    tauri_build::try_build(tauri_build::Attributes::new().windows_attributes(windows))
        .expect("failed to run build script");
}

#[cfg(not(target_os = "windows"))]
fn main() {
    tauri_build::build();
}