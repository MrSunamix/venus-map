// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/*
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;
use std::process::Child;
use std::sync::Mutex;
use tauri::Manager;

struct AppState {
    mosquitto_process: Mutex<Option<Child>>,
    config_file_path: Option<PathBuf>, // Added to manage the config file path
}

const MOSQUITTO_CONFIG: &str = r#"
# Default MQTT listener on port 1883
listener 1883
protocol mqtt
allow_anonymous true

# WebSocket listener on port 9001
listener 9001
protocol websockets
allow_anonymous true

# Connection to the external broker
connection bridge_to_external
address mqtt.ics.ele.tue.nl
topic # both 0           # Bridge all topics
remote_username Student41
remote_password Eay0EaQu

# Enable verbose logging
log_type all
log_dest stdout
connection_messages true
log_timestamp true
"#;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.app_handle();

            // Start Mosquitto and get config file path
            match start_mosquitto() {
                Ok((mosquitto_process, config_file_path)) => {
                    app_handle.manage(AppState {
                        mosquitto_process: Mutex::new(Some(mosquitto_process)),
                        config_file_path: Some(config_file_path), // Save config file path for later cleanup
                    });
                    Ok(())
                }
                Err(e) => {
                    eprintln!("Failed to start Mosquitto: {}", e);
                    Err(e)
                }
            }
        })
        .on_system_tray_event(|app, event| match event {
            tauri::SystemTrayEvent::LeftClick { .. } => {
                if let Some(window) = app.get_window("main") {
                    let _ = window.show().and_then(|_| window.set_focus());
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn start_mosquitto() -> Result<(Child, PathBuf), Box<dyn std::error::Error>> {
    // Use the system's temporary directory
    let config_file_path = std::env::temp_dir().join("mosquitto_temp.conf");

    // Write the configuration to the file
    let mut config_file = File::create(&config_file_path)?;
    write!(config_file, "{}", MOSQUITTO_CONFIG)?;

    println!("Mosquitto config file path: {:?}", config_file_path); // Debug output

    // Start the Mosquitto process with the temporary config file path
    let mosquitto_process = std::process::Command::new("mosquitto")
        .arg("-c")
        .arg(&config_file_path)
        .spawn()?;

    Ok((mosquitto_process, config_file_path))
}

fn stop_mosquitto(app_handle: &tauri::AppHandle) {
    let app_state: tauri::State<AppState> = app_handle.state();
    let mut mosquitto_process = app_state.mosquitto_process.lock().unwrap();
    if let Some(mut process) = mosquitto_process.take() {
        if let Err(e) = process.kill() {
            eprintln!("Error killing Mosquitto process: {}", e); // Detailed error output
        }
    }

    // Clean up the temporary configuration file
    if let Some(config_file_path) = &app_state.config_file_path {
        if std::fs::remove_file(config_file_path).is_err() {
            eprintln!("Failed to remove config file at {:?}", config_file_path);
        }
    }
}
*/
