import subprocess
import os

class ScreenManager:

    @staticmethod
    def is_session_running(session_name):
        """Check if a screen session with the given name already exists."""
        result = subprocess.run(
            ["screen", "-ls"], capture_output=True, text=True
        )
        # Check if the session name is present in the output
        return session_name in result.stdout
    
    @staticmethod
    def start_session(session_name, program):
        """Start a new screen session running a Python program."""

        if ScreenManager.is_session_running(session_name):
            return f"Error: Session '{session_name}' already exists."

        # Ensure the program exists
        program_path = os.path.abspath(program)  # Get absolute path
        if not os.path.isfile(program_path):
            return f"Error: Program '{program}' not found."

        try:
            result = subprocess.run(
                ["screen", "-S", session_name, "-d", "-m", "python3", program_path],
                check=True, capture_output=True, text=True
            )
            return f"Started session: {session_name} with output: {result.stdout}"
        except subprocess.CalledProcessError as e:
            return f"Error starting session: {e.stderr or str(e)}"

    @staticmethod
    def list_sessions():
        """List all active screen sessions."""
        result = subprocess.run(
            ["screen", "-ls"], capture_output=True, text=True
        )
        return result.stdout or "No active sessions."

    @staticmethod
    def stop_session(session_name):
        """Stop a screen session."""
        try:
            subprocess.run(
                ["screen", "-S", session_name, "-X", "quit"], check=True
            )
            return f"Stopped session: {session_name}"
        except subprocess.CalledProcessError as e:
            return f"Error stopping session: {str(e)}"

# Example usage
if __name__ == "__main__":
    print(ScreenManager.start_session("program1", "program1.py"))
    print(ScreenManager.list_sessions())
    print(ScreenManager.stop_session("program1"))