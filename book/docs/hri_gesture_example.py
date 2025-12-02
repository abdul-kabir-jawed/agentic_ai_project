import rclpy
from rclpy.node import Node
from std_msgs.msg import String # For publishing simple commands

class GestureRobotCommander(Node):
    def __init__(self):
        super().__init__('gesture_robot_commander')
        self.publisher_ = self.create_publisher(String, 'robot_gesture_command', 10)
        self.get_logger().info('Gesture Robot Commander node started.')
        self.gesture_mapping = {
            "wave": "COMMAND:STOP",
            "point_left": "COMMAND:MOVE_LEFT",
            "point_right": "COMMAND:MOVE_RIGHT",
            "thumbs_up": "COMMAND:ACKNOWLEDGE"
        }

    def process_gesture(self, gesture_input: str):
        self.get_logger().info(f"Received gesture: \'{gesture_input}\'")

        command = self.gesture_mapping.get(gesture_input.lower())

        if command:
            robot_command_msg = String()
            robot_command_msg.data = command
            self.publisher_.publish(robot_command_msg)
            self.get_logger().info(f"Published robot gesture command: \'{robot_command_msg.data}\'")
        else:
            self.get_logger().warn(f"Unknown gesture: \'{gesture_input}\'")

def main(args=None):
    rclpy.init(args=args)
    gesture_commander = GestureRobotCommander()

    # Simulate receiving gesture input
    gesture_commander.process_gesture("wave")
    gesture_commander.process_gesture("point_left")
    gesture_commander.process_gesture("unknown_gesture")

    rclpy.spin_once(gesture_commander, timeout_sec=1.0)
    gesture_commander.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()