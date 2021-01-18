/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

type FiberRootNode = any;
type ReactNativeFiberHostComponent = {
  tag: number,
  _nativeTag: number,
  _children: (number | ReactNativeFiberHostComponent)[],
  viewConfig: any,
  _internalFiberInstanceHandleDEV?: boolean,
  blur: () => void,
  focus: () => void,
  measure: (callback: (...args: any[]) => void) => void,
  measureInWindow: (callback: (...args: any[]) => void) => void,
  measureLayout: (
    relativeToNativeNode: number | ReactNativeFiberHostComponent,
    onSuccess: (...args: any[]) => void,
    onFail: (...args: any[]) => void,
  ) => void,
  setNativeProps: (nativeProps: any) => void,
};

type HostRootInstance = {
  nativeTag: null | number,
  nextSibling: null | number,
  children: number[],
};
type HostInstance = {
  nativeTag: number,
  tag: 5,
  type: string,
  nextSibling: null | number,
  children: number[],
  props?: any,
};
type TextInstance = {
  nativeTag: number,
  tag: 6,
  type: string,
  nextSibling: null | number,
  props: string,
};
type RawInstance = HostInstance | TextInstance;

type CreateHydrateTextInstance = (
  tag: number,
  text: string,
  rootContainerInstance: FiberRootNode,
  hostContext: any,
  internalInstanceHandle: any,
) => number;
type CreateHydrateInstance = (
  tag: number,
  type: string,
  props: any,
  rootContainerInstance: FiberRootNode,
  hostContext: any,
  internalInstanceHandle: any,
) => ReactNativeFiberHostComponent;

let root: HostRootInstance = {
  nativeTag: null,
  children: [],
  nextSibling: null,
};
const nodes: Map<number, RawInstance> = new Map();
const parents = {};
const instuctions = [
  [
    'createView',
    [3, 'RCTView', {collapsable: true, flex: 1, pointerEvents: 'box-none'}],
  ],
  ['createView', [5, 'RCTView', {flex: 1, pointerEvents: 'box-none'}]],
  ['setChildren', [5, [3]]],
  ['setChildren', [1, [5]]],
  ['createView', [7, 'RCTView', {height: 28, backgroundColor: -10969968}]],
  ['createView', [9, 'RCTRawText', {text: 'RNTester'}]],
  [
    'createView',
    [
      13,
      'RCTText',
      {
        fontSize: 19,
        fontWeight: '600',
        textAlign: 'center',
        allowFontScaling: true,
        color: -1,
        accessible: true,
        ellipsizeMode: 'tail',
      },
    ],
  ],
  ['setChildren', [13, [9]]],
  [
    'createView',
    [
      15,
      'RCTView',
      {
        flex: 1,
        position: 'absolute',
        top: 12,
        right: 0,
        alignItems: 'center',
        left: 0,
      },
    ],
  ],
  ['setChildren', [15, [13]]],
  [
    'createView',
    [
      17,
      'RCTImageView',
      {
        width: 48,
        src: [{uri: 'ic_menu_black_24dp'}],
        loadingIndicatorSrc: null,
        overflow: 'hidden',
        shouldNotifyLoadEvents: false,
        height: 48,
        defaultSrc: null,
      },
    ],
  ],
  ['createView', [19, 'RCTView', {marginTop: 2}]],
  ['setChildren', [19, [17]]],
  ['createView', [23, 'RCTView', {height: 56, backgroundColor: -12829629}]],
  ['setChildren', [23, [15, 19]]],
  ['createView', [25, 'RCTView', {flex: 1}]],
  ['setChildren', [25, [23]]],
  [
    'createView',
    [
      27,
      'RCTView',
      {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        collapsable: false,
      },
    ],
  ],
  ['setChildren', [27, [7, 25]]],
  [
    'createView',
    [
      29,
      'RCTView',
      {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: 1073741824,
        height: 28,
      },
    ],
  ],
  [
    'createView',
    [
      33,
      'RCTView',
      {
        position: 'absolute',
        top: 0,
        bottom: 0,
        backgroundColor: -1,
        width: 355.42857142857144,
        collapsable: false,
      },
    ],
  ],
  ['setChildren', [33, [29]]],
  [
    'createView',
    [
      35,
      'AndroidDrawerLayout',
      {
        drawerPosition: 'left',
        drawerWidth: 355.42857142857144,
        flex: 1,
        elevation: 16,
      },
    ],
  ],
  ['setChildren', [35, [27, 33]]],
  ['manageChildren', [3, [], [], [35], [0], []]],
];

const HydrateUIManagerJS = {
  _map: (new Map(): Map<number, number | ReactNativeFiberHostComponent>),
  setup: function(
    createHydrateInstance: CreateHydrateInstance,
    createHydrateTextInstance: CreateHydrateTextInstance,
    rootContainerInstance: FiberRootNode,
    hostContext: null | any,
    internalInstanceHandle: null | any,
  ) {
    nodes.set(rootContainerInstance.containerInfo, {
      nativeTag: rootContainerInstance.containerInfo,
      nextSibling: null,
      children: [],
    });

    instuctions.forEach(([command, params]) => {
      if (command === 'createView') {
        if (params[1] === 'RCTRawText') {
          nodes.set(
            params[0],
            createHydrateTextInstance(
              params[0],
              params[2].text,
              rootContainerInstance,
              hostContext,
              internalInstanceHandle,
            ),
          );
          return;
        }
        const node = createHydrateInstance(
          params[0],
          params[1],
          params[2],
          rootContainerInstance,
          hostContext,
          internalInstanceHandle,
        );
        node.tag = 5;
        nodes.set(params[0], node);
      } else if (command === 'setChildren') {
        if (params[0] === 1) {
          nodes.get(
            rootContainerInstance.containerInfo,
          ).children = params[1].map(child => nodes.get(child));
          params[1].forEach(child => {
            parents[child] = rootContainerInstance.containerInfo;
          });
          return;
        }

        nodes.get(params[0])._children = params[1].map(child =>
          nodes.get(child),
        );

        params[1].forEach(child => {
          parents[child] = params[0];
        });
      } else if (command === 'manageChildren') {
        const parent = nodes.get(params[0]);
        // const numToMove = params[1];
        // if (numToMove > 0) {
        //   for (let i = 0; i < numToMove; i++) {
        //     const moveFromIndex = moveFrom[i];
        //     const tagToMove = parent.children[moveFromIndex].nativeTag;
        //     viewsToAdd[i] = new ViewAtIndex(tagToMove, moveTo.getInt(i));
        //     indicesToRemove[i] = moveFromIndex;
        //     tagsToRemove[i] = tagToMove;
        //   }
        // }
        const numToAdd = params[3];
        // FIXME:
        parent._children = [
          ...numToAdd.map(tag => nodes.get(tag)),
          ...parent._children,
        ];
        numToAdd.forEach(tag => {
          parents[tag] = params[0];
        });
      }
    });

    root = nodes.get(rootContainerInstance.containerInfo);
  },
  getNextSibling(instance: RawInstance): ReactNativeFiberHostComponent | null {
    // HostRoot or empty
    if (instance == null || instance.nativeTag === root.nativeTag) {
      return null;
    }

    // If instance is HostText will use it directly, if a HostComponent will get from _nativeTag
    const key = typeof instance === 'number' ? instance : instance._nativeTag;

    const parentTag = parents[key];
    const parent = nodes.get(parentTag);

    // If parent is HostRoot will use `children`
    if (parentTag === root.nativeTag) {
      const index = parent.children.findIndex(child => child === instance);
      // if (index < 0) {
      //   console.log('Something went wrong', parent.children, instance);
      // }
      return parent.children.length <= index + 1
        ? null
        : parent.children[index + 1];
    }

    // if (!parent) {
    //   console.log('parent gone', instance);
    // }
    const index = parent._children.findIndex(child => child === instance);
    // if (index < 0) {
    //   console.log('Something went wrong', parent._children, instance);
    // }
    return parent._children.length <= index + 1
      ? null
      : parent._children[index + 1];
  },
  getFirstChild(
    instance: ReactNativeFiberHostComponent,
  ): number | ReactNativeFiberHostComponent | void {
    if (instance == null) {
      return null;
    }
    // HostRoot or HostText
    if (typeof instance === 'number') {
      return instance === root.nativeTag ? root.children[0] : null;
    }
    return instance._children[0] || null;
  },
};

module.exports = HydrateUIManagerJS;
