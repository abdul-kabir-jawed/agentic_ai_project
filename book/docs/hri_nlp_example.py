import rclpy
from rclpy.node import Node
from std_msgs.msg import String # For publishing simple commands
import re

class NLPRobotCommander(Node):
    def __init__(self):
        super().__init__('nlp_robot_commander')
        self.publisher_ = self.create_publisher(String, 'robot_command', 10)
        self.get_logger().info('NLP Robot Commander node started.')

    def parse_and_command(self, natural_language_input: str):
        self.get_logger().info(f"Received command: \'{natural_language_input}\'")
        command = None
        target_object = None
        location = None

        # Define keywords for actions
        move_keywords = ["move", "go", "navigate"]
        pick_keywords = ["pick up", "grasp", "take"]

        # Simple pattern matching for intent and entities
        if any(keyword in natural_language_input.lower() for keyword in move_keywords):
            command = "move"
            match = re.search(r'(to|at|towards)\s+(the\s+)?(\w+)', natural_language_input.lower())
            if match:
                location = match.group(3)
        elif any(keyword in natural_language_input.lower() for keyword in pick_keywords):
            command = "pick"
            match = re.search(r'(pick up|grasp|take)\s+(the\s+)?(\w+)', natural_language_input.lower())
            if match:
                target_object = match.group(3)

        if command:
            robot_command_msg = String()
            if command == "move":
                robot_command_msg.data = f"COMMAND:MOVE LOCATION:{location if location else 'UNKNOWN'}"
            elif command == "pick":
                robot_command_msg.data = f"COMMAND:PICK OBJECT:{target_object if target_object else 'UNKNOWN'}"

            self.publisher_.publish(robot_command_msg)
            self.get_logger().info(f"Published robot command: \'{robot_command_msg.data}\'")
        else:
            self.get_logger().warn("Could not parse command.")

def main(args=None):
    rclpy.init(args=args)
    nlp_commander = NLPRobotCommander()

    # Simulate receiving natural language input
    nlp_commander.parse_and_command("Please move the robot to the charging station.")
    nlp_commander.parse_and_command("Pick up the red block.")
    nlp_commander.parse_and_command("Go to the kitchen.")
    nlp_commander.parse_and_command("What time is it?") # Unparseable command

    rclpy.spin_once(nlp_commander, timeout_sec=1.0) # Process published messages
    nlp_commander.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()