import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/search',
    component: ComponentCreator('/search', '822'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '06f'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '41d'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '020'),
            routes: [
              {
                path: '/docs/chapters/appendices/',
                component: ComponentCreator('/docs/chapters/appendices/', 'cb2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/week-13-conversational-robotics/',
                component: ComponentCreator('/docs/chapters/week-13-conversational-robotics/', 'cdb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/week-13-conversational-robotics/capstone-full-autonomous-humanoid',
                component: ComponentCreator('/docs/chapters/week-13-conversational-robotics/capstone-full-autonomous-humanoid', '3da'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/week-13-conversational-robotics/vision-language-action-2025',
                component: ComponentCreator('/docs/chapters/week-13-conversational-robotics/vision-language-action-2025', '476'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/week-13-conversational-robotics/voice-to-action-pipeline',
                component: ComponentCreator('/docs/chapters/week-13-conversational-robotics/voice-to-action-pipeline', 'b43'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-1-2-foundations/',
                component: ComponentCreator('/docs/chapters/weeks-1-2-foundations/', '743'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-1-2-foundations/embodied-intelligence-2025',
                component: ComponentCreator('/docs/chapters/weeks-1-2-foundations/embodied-intelligence-2025', '567'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-1-2-foundations/humanoid-landscape-2025',
                component: ComponentCreator('/docs/chapters/weeks-1-2-foundations/humanoid-landscape-2025', '4d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-1-2-foundations/physical-laws-and-robotics',
                component: ComponentCreator('/docs/chapters/weeks-1-2-foundations/physical-laws-and-robotics', '24d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-1-2-foundations/sensor-systems-deep-dive',
                component: ComponentCreator('/docs/chapters/weeks-1-2-foundations/sensor-systems-deep-dive', 'dba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-11-12-humanoid-development/',
                component: ComponentCreator('/docs/chapters/weeks-11-12-humanoid-development/', '71a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-11-12-humanoid-development/bipedal-locomotion-2025',
                component: ComponentCreator('/docs/chapters/weeks-11-12-humanoid-development/bipedal-locomotion-2025', '94b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-11-12-humanoid-development/dexterous-manipulation',
                component: ComponentCreator('/docs/chapters/weeks-11-12-humanoid-development/dexterous-manipulation', '1f2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-11-12-humanoid-development/humanoid-benchmarks-2025',
                component: ComponentCreator('/docs/chapters/weeks-11-12-humanoid-development/humanoid-benchmarks-2025', '200'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-11-12-humanoid-development/whole-body-control',
                component: ComponentCreator('/docs/chapters/weeks-11-12-humanoid-development/whole-body-control', '063'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-3-5-ros2/',
                component: ComponentCreator('/docs/chapters/weeks-3-5-ros2/', 'b3f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-3-5-ros2/nodes-topics-services-actions',
                component: ComponentCreator('/docs/chapters/weeks-3-5-ros2/nodes-topics-services-actions', '3a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-3-5-ros2/rclpy-agent-bridge',
                component: ComponentCreator('/docs/chapters/weeks-3-5-ros2/rclpy-agent-bridge', '613'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-3-5-ros2/ros2-core-architecture',
                component: ComponentCreator('/docs/chapters/weeks-3-5-ros2/ros2-core-architecture', 'd95'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-3-5-ros2/ros2-project-walkthrough',
                component: ComponentCreator('/docs/chapters/weeks-3-5-ros2/ros2-project-walkthrough', 'acd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-3-5-ros2/urdf-xacro-sdf-humanoids',
                component: ComponentCreator('/docs/chapters/weeks-3-5-ros2/urdf-xacro-sdf-humanoids', '175'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-6-7-simulation/',
                component: ComponentCreator('/docs/chapters/weeks-6-7-simulation/', 'ef4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-6-7-simulation/gazebo-mastery-2025',
                component: ComponentCreator('/docs/chapters/weeks-6-7-simulation/gazebo-mastery-2025', '8b1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-6-7-simulation/physics-engines-and-sim2real-gap',
                component: ComponentCreator('/docs/chapters/weeks-6-7-simulation/physics-engines-and-sim2real-gap', '739'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-6-7-simulation/sensor-simulation-lidar-imu-depth',
                component: ComponentCreator('/docs/chapters/weeks-6-7-simulation/sensor-simulation-lidar-imu-depth', '82b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-6-7-simulation/unity-digital-twin',
                component: ComponentCreator('/docs/chapters/weeks-6-7-simulation/unity-digital-twin', '646'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-8-10-nvidia-isaac/',
                component: ComponentCreator('/docs/chapters/weeks-8-10-nvidia-isaac/', '8d6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-8-10-nvidia-isaac/isaac-ros-gemini-and-vslam',
                component: ComponentCreator('/docs/chapters/weeks-8-10-nvidia-isaac/isaac-ros-gemini-and-vslam', '65f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-8-10-nvidia-isaac/isaac-sim-2025-mastery',
                component: ComponentCreator('/docs/chapters/weeks-8-10-nvidia-isaac/isaac-sim-2025-mastery', '831'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-8-10-nvidia-isaac/rl-for-humanoids-in-isaac',
                component: ComponentCreator('/docs/chapters/weeks-8-10-nvidia-isaac/rl-for-humanoids-in-isaac', 'a22'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-8-10-nvidia-isaac/sim2real-transfer-2025',
                component: ComponentCreator('/docs/chapters/weeks-8-10-nvidia-isaac/sim2real-transfer-2025', 'fa7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/chapters/weeks-8-10-nvidia-isaac/synthetic-data-at-scale',
                component: ComponentCreator('/docs/chapters/weeks-8-10-nvidia-isaac/synthetic-data-at-scale', '570'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/hardware-requirements',
                component: ComponentCreator('/docs/hardware-requirements', '2c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '89a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/preface',
                component: ComponentCreator('/docs/preface', '4d0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/test',
                component: ComponentCreator('/docs/test', '0fd'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
