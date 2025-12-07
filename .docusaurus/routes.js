import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/book/__docusaurus/debug',
    component: ComponentCreator('/book/__docusaurus/debug', 'f31'),
    exact: true
  },
  {
    path: '/book/__docusaurus/debug/config',
    component: ComponentCreator('/book/__docusaurus/debug/config', '140'),
    exact: true
  },
  {
    path: '/book/__docusaurus/debug/content',
    component: ComponentCreator('/book/__docusaurus/debug/content', 'da6'),
    exact: true
  },
  {
    path: '/book/__docusaurus/debug/globalData',
    component: ComponentCreator('/book/__docusaurus/debug/globalData', '58b'),
    exact: true
  },
  {
    path: '/book/__docusaurus/debug/metadata',
    component: ComponentCreator('/book/__docusaurus/debug/metadata', 'ae0'),
    exact: true
  },
  {
    path: '/book/__docusaurus/debug/registry',
    component: ComponentCreator('/book/__docusaurus/debug/registry', 'a8a'),
    exact: true
  },
  {
    path: '/book/__docusaurus/debug/routes',
    component: ComponentCreator('/book/__docusaurus/debug/routes', 'a5a'),
    exact: true
  },
  {
    path: '/book/search',
    component: ComponentCreator('/book/search', 'c73'),
    exact: true
  },
  {
    path: '/book/search',
    component: ComponentCreator('/book/search', 'd23'),
    exact: true
  },
  {
    path: '/book/docs',
    component: ComponentCreator('/book/docs', 'fa7'),
    routes: [
      {
        path: '/book/docs',
        component: ComponentCreator('/book/docs', 'a20'),
        routes: [
          {
            path: '/book/docs',
            component: ComponentCreator('/book/docs', 'd76'),
            routes: [
              {
                path: '/book/docs/chapters/appendices/',
                component: ComponentCreator('/book/docs/chapters/appendices/', '885'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/week-13-conversational-robotics/',
                component: ComponentCreator('/book/docs/chapters/week-13-conversational-robotics/', 'aca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/week-13-conversational-robotics/capstone-full-autonomous-humanoid',
                component: ComponentCreator('/book/docs/chapters/week-13-conversational-robotics/capstone-full-autonomous-humanoid', '4d3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/week-13-conversational-robotics/vision-language-action-2025',
                component: ComponentCreator('/book/docs/chapters/week-13-conversational-robotics/vision-language-action-2025', 'ee4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/week-13-conversational-robotics/voice-to-action-pipeline',
                component: ComponentCreator('/book/docs/chapters/week-13-conversational-robotics/voice-to-action-pipeline', '8ea'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-1-2-foundations/',
                component: ComponentCreator('/book/docs/chapters/weeks-1-2-foundations/', '979'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-1-2-foundations/embodied-intelligence-2025',
                component: ComponentCreator('/book/docs/chapters/weeks-1-2-foundations/embodied-intelligence-2025', '2de'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-1-2-foundations/humanoid-landscape-2025',
                component: ComponentCreator('/book/docs/chapters/weeks-1-2-foundations/humanoid-landscape-2025', '86b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-1-2-foundations/physical-laws-and-robotics',
                component: ComponentCreator('/book/docs/chapters/weeks-1-2-foundations/physical-laws-and-robotics', 'dae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-1-2-foundations/sensor-systems-deep-dive',
                component: ComponentCreator('/book/docs/chapters/weeks-1-2-foundations/sensor-systems-deep-dive', 'd87'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-11-12-humanoid-development/',
                component: ComponentCreator('/book/docs/chapters/weeks-11-12-humanoid-development/', '5ff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-11-12-humanoid-development/bipedal-locomotion-2025',
                component: ComponentCreator('/book/docs/chapters/weeks-11-12-humanoid-development/bipedal-locomotion-2025', '41d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-11-12-humanoid-development/dexterous-manipulation',
                component: ComponentCreator('/book/docs/chapters/weeks-11-12-humanoid-development/dexterous-manipulation', 'ecf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-11-12-humanoid-development/humanoid-benchmarks-2025',
                component: ComponentCreator('/book/docs/chapters/weeks-11-12-humanoid-development/humanoid-benchmarks-2025', '422'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-11-12-humanoid-development/whole-body-control',
                component: ComponentCreator('/book/docs/chapters/weeks-11-12-humanoid-development/whole-body-control', 'f83'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-3-5-ros2/',
                component: ComponentCreator('/book/docs/chapters/weeks-3-5-ros2/', 'a4d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-3-5-ros2/nodes-topics-services-actions',
                component: ComponentCreator('/book/docs/chapters/weeks-3-5-ros2/nodes-topics-services-actions', '126'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-3-5-ros2/rclpy-agent-bridge',
                component: ComponentCreator('/book/docs/chapters/weeks-3-5-ros2/rclpy-agent-bridge', 'a64'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-3-5-ros2/ros2-core-architecture',
                component: ComponentCreator('/book/docs/chapters/weeks-3-5-ros2/ros2-core-architecture', '0d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-3-5-ros2/ros2-project-walkthrough',
                component: ComponentCreator('/book/docs/chapters/weeks-3-5-ros2/ros2-project-walkthrough', 'f09'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-3-5-ros2/urdf-xacro-sdf-humanoids',
                component: ComponentCreator('/book/docs/chapters/weeks-3-5-ros2/urdf-xacro-sdf-humanoids', '819'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-6-7-simulation/',
                component: ComponentCreator('/book/docs/chapters/weeks-6-7-simulation/', 'e66'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-6-7-simulation/gazebo-mastery-2025',
                component: ComponentCreator('/book/docs/chapters/weeks-6-7-simulation/gazebo-mastery-2025', '051'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-6-7-simulation/physics-engines-and-sim2real-gap',
                component: ComponentCreator('/book/docs/chapters/weeks-6-7-simulation/physics-engines-and-sim2real-gap', '5af'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-6-7-simulation/sensor-simulation-lidar-imu-depth',
                component: ComponentCreator('/book/docs/chapters/weeks-6-7-simulation/sensor-simulation-lidar-imu-depth', '774'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-6-7-simulation/unity-digital-twin',
                component: ComponentCreator('/book/docs/chapters/weeks-6-7-simulation/unity-digital-twin', '8ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-8-10-nvidia-isaac/',
                component: ComponentCreator('/book/docs/chapters/weeks-8-10-nvidia-isaac/', '340'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-8-10-nvidia-isaac/isaac-ros-gemini-and-vslam',
                component: ComponentCreator('/book/docs/chapters/weeks-8-10-nvidia-isaac/isaac-ros-gemini-and-vslam', '5a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-8-10-nvidia-isaac/isaac-sim-2025-mastery',
                component: ComponentCreator('/book/docs/chapters/weeks-8-10-nvidia-isaac/isaac-sim-2025-mastery', '95d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-8-10-nvidia-isaac/rl-for-humanoids-in-isaac',
                component: ComponentCreator('/book/docs/chapters/weeks-8-10-nvidia-isaac/rl-for-humanoids-in-isaac', 'a06'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-8-10-nvidia-isaac/sim2real-transfer-2025',
                component: ComponentCreator('/book/docs/chapters/weeks-8-10-nvidia-isaac/sim2real-transfer-2025', 'e90'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/chapters/weeks-8-10-nvidia-isaac/synthetic-data-at-scale',
                component: ComponentCreator('/book/docs/chapters/weeks-8-10-nvidia-isaac/synthetic-data-at-scale', '4f0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/hardware-requirements',
                component: ComponentCreator('/book/docs/hardware-requirements', 'f73'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/intro',
                component: ComponentCreator('/book/docs/intro', 'b8b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/preface',
                component: ComponentCreator('/book/docs/preface', '69f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/book/docs/test',
                component: ComponentCreator('/book/docs/test', 'c5c'),
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
    path: '/book/',
    component: ComponentCreator('/book/', 'fcd'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
