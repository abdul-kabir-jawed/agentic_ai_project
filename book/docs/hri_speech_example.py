import rclpy
from rclpy.node import Node
from std_msgs.msg import String # For publishing simple commands
import re

class SpeechRobotCommander(Node):
    def __init__(self):
        super().__init__('speech_robot_commander')
        self.publisher_ = self.create_publisher(String, 'robot_speech_command', 10)
        self.get_logger().info('Speech Robot Commander node started.')
        self.command_phrases = {
            "stop": "COMMAND:HALT",
            "go forward": "COMMAND:MOVE_FORWARD",
            "turn left": "COMMAND:TURN_LEFT",
            "hello robot": "COMMAND:GREET"
        }

    def process_speech_text(self, speech_text: str):
        self.get_logger().info(f"Received speech text: \'{speech_text}\'")

        # Simple matching for predefined command phrases
        command = None
        for phrase, robot_cmd in self.command_phrases.items():
            if phrase in speech_text.lower():
                command = robot_cmd
                break

        if command:
            robot_command_msg = String()
            robot_command_msg.data = command
            self.publisher_.publish(robot_command_msg)
            self.get_logger().info(f"Published robot speech command: \'{robot_command_msg.data}\'")
        else:
            self.get_logger().warn(f"Could not understand speech command: \'{speech_text}\'")

def main(args=None):
    rclpy.init(args=args)
    speech_commander = SpeechRobotCommander()

    # Simulate ASR output
    speech_commander.process_speech_text("Robot, please stop now.")
    speech_commander.process_speech_text("Can you go forward a bit?")
    speech_commander.process_speech_text("What\'s the weather like?") # Ununderstood command

    rclpy.spin_once(speech_commander, timeout_sec=1.0)
    speech_commander.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()