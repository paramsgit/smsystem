from models.model_sms import log_sms
import time,random
class SendSMS:
    def __init__(self, phone_number, proxy, country, operator):
        self.phone_number = phone_number
        self.proxy = proxy
        self.country = country
        self.operator = operator

    def send_otp(self):
        """Simulate sending SMS and log the result."""
        try:
            # Simulate sending SMS (replace with actual SMS gateway logic)
            response = {"status": "success"}

            time.sleep(2)
            random_int = random.randint(1, 10)

            if random_int > 7:
                response = {"status": "failed"}
            print(random_int,response)

            if response["status"] == "success":
                log_sms(self.country, self.operator, "sent")
                return True
            else:
                raise Exception("Failed to send SMS")

        except Exception as e:
            log_sms(self.country, self.operator, "failed", str(e))
            return False
