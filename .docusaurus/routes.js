import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/physical-ai-book/search',
    component: ComponentCreator('/physical-ai-book/search', '28f'),
    exact: true
  },
  {
    path: '/physical-ai-book/docs',
    component: ComponentCreator('/physical-ai-book/docs', '008'),
    routes: [
      {
        path: '/physical-ai-book/docs',
        component: ComponentCreator('/physical-ai-book/docs', 'd9e'),
        routes: [
          {
            path: '/physical-ai-book/docs',
            component: ComponentCreator('/physical-ai-book/docs', '18f'),
            routes: [
              {
                path: '/physical-ai-book/docs/chapters/appendices/',
                component: ComponentCreator('/physical-ai-book/docs/chapters/appendices/', '4b8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/week-13-conversational-robotics/',
                component: ComponentCreator('/physical-ai-book/docs/chapters/week-13-conversational-robotics/', 'e4d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/week-13-conversational-robotics/capstone-full-autonomous-humanoid',
                component: ComponentCreator('/physical-ai-book/docs/chapters/week-13-conversational-robotics/capstone-full-autonomous-humanoid', '23a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/week-13-conversational-robotics/vision-language-action-2025',
                component: ComponentCreator('/physical-ai-book/docs/chapters/week-13-conversational-robotics/vision-language-action-2025', '654'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/week-13-conversational-robotics/voice-to-action-pipeline',
                component: ComponentCreator('/physical-ai-book/docs/chapters/week-13-conversational-robotics/voice-to-action-pipeline', 'a3b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-1-2-foundations/',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-1-2-foundations/', 'eed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-1-2-foundations/embodied-intelligence-2025',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-1-2-foundations/embodied-intelligence-2025', 'e85'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-1-2-foundations/humanoid-landscape-2025',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-1-2-foundations/humanoid-landscape-2025', '7fa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-1-2-foundations/physical-laws-and-robotics',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-1-2-foundations/physical-laws-and-robotics', 'a33'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-1-2-foundations/sensor-systems-deep-dive',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-1-2-foundations/sensor-systems-deep-dive', 'a7b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-11-12-humanoid-development/',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-11-12-humanoid-development/', '97e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-11-12-humanoid-development/bipedal-locomotion-2025',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-11-12-humanoid-development/bipedal-locomotion-2025', 'b0b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-11-12-humanoid-development/dexterous-manipulation',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-11-12-humanoid-development/dexterous-manipulation', 'b14'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-11-12-humanoid-development/humanoid-benchmarks-2025',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-11-12-humanoid-development/humanoid-benchmarks-2025', '541'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-11-12-humanoid-development/whole-body-control',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-11-12-humanoid-development/whole-body-control', '655'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-3-5-ros2/',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-3-5-ros2/', 'dbb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-3-5-ros2/nodes-topics-services-actions',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-3-5-ros2/nodes-topics-services-actions', '227'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-3-5-ros2/rclpy-agent-bridge',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-3-5-ros2/rclpy-agent-bridge', '4e3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-3-5-ros2/ros2-core-architecture',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-3-5-ros2/ros2-core-architecture', '874'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-3-5-ros2/ros2-project-walkthrough',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-3-5-ros2/ros2-project-walkthrough', '2bb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-3-5-ros2/urdf-xacro-sdf-humanoids',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-3-5-ros2/urdf-xacro-sdf-humanoids', '549'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-6-7-simulation/',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-6-7-simulation/', '4a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-6-7-simulation/gazebo-mastery-2025',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-6-7-simulation/gazebo-mastery-2025', 'a87'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-6-7-simulation/physics-engines-and-sim2real-gap',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-6-7-simulation/physics-engines-and-sim2real-gap', 'ca4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-6-7-simulation/sensor-simulation-lidar-imu-depth',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-6-7-simulation/sensor-simulation-lidar-imu-depth', 'a80'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-6-7-simulation/unity-digital-twin',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-6-7-simulation/unity-digital-twin', '381'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/', '06a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/isaac-ros-gemini-and-vslam',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/isaac-ros-gemini-and-vslam', 'fed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/isaac-sim-2025-mastery',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/isaac-sim-2025-mastery', '507'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/rl-for-humanoids-in-isaac',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/rl-for-humanoids-in-isaac', 'f9e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/sim2real-transfer-2025',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/sim2real-transfer-2025', '3a3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/synthetic-data-at-scale',
                component: ComponentCreator('/physical-ai-book/docs/chapters/weeks-8-10-nvidia-isaac/synthetic-data-at-scale', 'bab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/hardware-requirements',
                component: ComponentCreator('/physical-ai-book/docs/hardware-requirements', '6c1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/intro',
                component: ComponentCreator('/physical-ai-book/docs/intro', 'bdb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/preface',
                component: ComponentCreator('/physical-ai-book/docs/preface', '349'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/physical-ai-book/docs/test',
                component: ComponentCreator('/physical-ai-book/docs/test', '43f'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/physical-ai-book/',
    component: ComponentCreator('/physical-ai-book/', '003'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
