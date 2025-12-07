#!/usr/bin/env python3
"""
Setup and run script for the Physical AI and Humanoid Robotics RAG Chatbot Backend
This script handles dependency installation and starts the backend server on Windows
"""

import subprocess
import sys
import os
import platform
from pathlib import Path

def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"\n{description}")
    print(f"Running: {cmd}")

    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        if result.stdout:
            print("Output:", result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(f"Error output: {e.stderr}")
        return False

def main():
    print("Physical AI and Humanoid Robotics RAG Chatbot - Setup and Run")
    print("=" * 60)

    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    print(f"Changed to directory: {backend_dir}")

    # Check Python version
    print(f"Python version: {platform.python_version()}")

    # Check if virtual environment exists, create if not
    venv_path = backend_dir / "venv"
    if not venv_path.exists():
        print("\nCreating virtual environment...")
        try:
            subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
            print("Virtual environment created successfully")
        except subprocess.CalledProcessError:
            print("Failed to create virtual environment")
            return False

    # Determine the path to pip in the virtual environment
    if platform.system() == "Windows":
        pip_path = str(venv_path / "Scripts" / "pip.exe")
        python_path = str(venv_path / "Scripts" / "python.exe")
    else:
        pip_path = str(venv_path / "bin" / "pip")
        python_path = str(venv_path / "bin" / "python")

    print(f"\nUsing pip: {pip_path}")

    # Upgrade pip first
    print("\nUpgrading pip...")
    try:
        subprocess.run([pip_path, "install", "--upgrade", "pip"], check=True)
        print("Pip upgraded successfully")
    except subprocess.CalledProcessError:
        print("Failed to upgrade pip, continuing...")

    # Install dependencies with error handling for Windows
    print("\nInstalling dependencies...")
    requirements_file = backend_dir / "requirements.txt"

    if not requirements_file.exists():
        print(f"Error: requirements.txt not found at {requirements_file}")
        return False

    # Try to install requirements with more verbose output
    cmd = f'"{pip_path}" install -r requirements.txt --verbose'
    print(f"Running: {cmd}")

    try:
        result = subprocess.run(
            cmd,
            shell=True,
            check=False,  # Don't raise exception, we'll check return code
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        if result.returncode != 0:
            print("Standard output:", result.stdout)
            print("Standard error:", result.stderr)

            # If standard install fails, try installing packages one by one
            print("\nStandard installation failed. Trying alternative approach...")

            with open(requirements_file, 'r') as f:
                packages = [line.strip() for line in f if line.strip() and not line.startswith('#')]

            for package in packages:
                print(f"\nInstalling {package}...")
                try:
                    install_result = subprocess.run(
                        [pip_path, "install", package],
                        check=False,
                        capture_output=True,
                        text=True
                    )
                    if install_result.returncode != 0:
                        print(f"Failed to install {package}: {install_result.stderr}")
                    else:
                        print(f"Successfully installed {package}")
                except Exception as e:
                    print(f"Error installing {package}: {e}")
        else:
            print("All dependencies installed successfully!")

    except Exception as e:
        print(f"Error during dependency installation: {e}")
        return False

    # Check if .env file exists, create from .env.example if not
    env_file = backend_dir / ".env"
    env_example = backend_dir / ".env.example"

    if not env_file.exists() and env_example.exists():
        print("\nCreating .env file from .env.example...")
        try:
            import shutil
            shutil.copy(env_example, env_file)
            print("Created .env file. Please update it with your actual API keys.")
        except Exception as e:
            print(f"Could not create .env file: {e}")

    # Start the backend server
    print("\nStarting the backend server...")
    print("Server will be available at http://127.0.0.1:8000")
    print("Press Ctrl+C to stop the server")

    try:
        # Use the python from the virtual environment to start the server
        server_cmd = [python_path, "-m", "uvicorn", "app.main:app", "--reload", "--host", "127.0.0.1", "--port", "8000", "--log-level", "info"]
        print(f"Running: {' '.join(server_cmd)}")

        subprocess.run(server_cmd)
    except KeyboardInterrupt:
        print("\nServer stopped by user.")
    except Exception as e:
        print(f"Error starting server: {e}")

    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\nSetup and run completed successfully!")
    else:
        print("\nSetup and run encountered errors!")
        sys.exit(1)