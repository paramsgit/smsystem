import time

def main():
    print("Program1 is running inside the screen session...")
    for i in range(1, 11):
        print(f"Message {i}: Hello from Program1!")
        time.sleep(5)  # Wait for 5 seconds between each message

    print("Program1 has finished execution.")

if __name__ == "__main__":
    main()

