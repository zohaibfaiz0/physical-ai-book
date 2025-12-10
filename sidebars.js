// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'intro',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Hardware Requirements',
      items: [
        'hardware-requirements',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Preface',
      items: [
        'preface',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Chapters',
      items: [
        {
          type: 'category',
          label: 'Weeks 1-2: Foundations of Physical AI',
          items: [
            'chapters/weeks-1-2-foundations/index',
            'chapters/weeks-1-2-foundations/embodied-intelligence-2025',
            'chapters/weeks-1-2-foundations/physical-laws-and-robotics',
            'chapters/weeks-1-2-foundations/humanoid-landscape-2025',
            'chapters/weeks-1-2-foundations/sensor-systems-deep-dive',
          ],
          collapsed: false,
        },
        {
          type: 'category',
          label: 'Weeks 3-5: ROS2',
          items: [
            'chapters/weeks-3-5-ros2/index',
            'chapters/weeks-3-5-ros2/ros2-core-architecture',
            'chapters/weeks-3-5-ros2/nodes-topics-services-actions',
            'chapters/weeks-3-5-ros2/urdf-xacro-sdf-humanoids',
            'chapters/weeks-3-5-ros2/rclpy-agent-bridge',
            'chapters/weeks-3-5-ros2/ros2-project-walkthrough',
          ],
          collapsed: false,
        },
        {
          type: 'category',
          label: 'Weeks 6-7: Simulation',
          items: [
            'chapters/weeks-6-7-simulation/index',
            'chapters/weeks-6-7-simulation/gazebo-mastery-2025',
            'chapters/weeks-6-7-simulation/unity-digital-twin',
            'chapters/weeks-6-7-simulation/sensor-simulation-lidar-imu-depth',
            'chapters/weeks-6-7-simulation/physics-engines-and-sim2real-gap',
          ],
          collapsed: false,
        },
        {
          type: 'category',
          label: 'Weeks 8-10: NVIDIA Isaac',
          items: [
            'chapters/weeks-8-10-nvidia-isaac/index',
            'chapters/weeks-8-10-nvidia-isaac/isaac-sim-2025-mastery',
            'chapters/weeks-8-10-nvidia-isaac/isaac-ros-gemini-and-vslam',
            'chapters/weeks-8-10-nvidia-isaac/synthetic-data-at-scale',
            'chapters/weeks-8-10-nvidia-isaac/sim2real-transfer-2025',
            'chapters/weeks-8-10-nvidia-isaac/rl-for-humanoids-in-isaac',
          ],
          collapsed: false,
        },
        {
          type: 'category',
          label: 'Weeks 11-12: Humanoid Development',
          items: [
            'chapters/weeks-11-12-humanoid-development/index',
            'chapters/weeks-11-12-humanoid-development/bipedal-locomotion-2025',
            'chapters/weeks-11-12-humanoid-development/dexterous-manipulation',
            'chapters/weeks-11-12-humanoid-development/whole-body-control',
            'chapters/weeks-11-12-humanoid-development/humanoid-benchmarks-2025',
          ],
          collapsed: false,
        },
        {
          type: 'category',
          label: 'Week 13: Conversational Robotics',
          items: [
            'chapters/week-13-conversational-robotics/index',
            'chapters/week-13-conversational-robotics/vision-language-action-2025',
            'chapters/week-13-conversational-robotics/voice-to-action-pipeline',
            'chapters/week-13-conversational-robotics/capstone-full-autonomous-humanoid',
          ],
          collapsed: false,
        },
        {
          type: 'category',
          label: 'Appendices',
          items: [
            'chapters/appendices/index',
          ],
          collapsed: false,
        },
      ],
      collapsed: false,
    },
  ],
};

module.exports = sidebars;