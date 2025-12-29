import React from 'react';
import { useState, useMemo, useRef } from 'react';
import { SafeAreaView, PanResponder, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import Header from './components/Header.js';
import SketchPad from './components/SketchPad.js';
import ToolBar from './components/ToolBar.js';

export default function App() {
  const [mode, setMode] = useState('draw');
  const [strokes, setStrokes] = useState([]);
  const [current, setCurrent] = useState([]);
  const sketchRef = useRef(null);
  const ERASE_RADIUS = 12;
  const handleMode = modeName => {
    setMode(`${modeName}`);
  };
  const refresh = () => {
    setMode('draw');
    setCurrent([]);
    setStrokes([]);
  };
  const handleSearch = async () => {
    const img = await captureRef(sketchRef, { format: 'png', quality: 1 });
    console.log(img);
  };
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: e => {
          const { locationX, locationY } = e.nativeEvent;

          if (mode === 'erase') {
            setStrokes(prev =>
              prev.filter(
                v =>
                  !v.some(c => {
                    const dx = c.x - locationX;
                    const dy = c.y - locationY;
                    return Math.sqrt(dx * dx + dy * dy) < ERASE_RADIUS;
                  }),
              ),
            );
          } else setCurrent([{ x: locationX, y: locationY }]);
        },
        onPanResponderMove: e => {
          const { locationX, locationY } = e.nativeEvent;

          if (mode === 'erase') {
            setStrokes(prev =>
              prev.filter(
                v =>
                  !v.some(c => {
                    const dx = c.x - locationX;
                    const dy = c.y - locationY;
                    return Math.sqrt(dx * dx + dy * dy) < ERASE_RADIUS;
                  }),
              ),
            );
          } else {
            setCurrent(prev => [...prev, { x: locationX, y: locationY }]);
          }
        },
        onPanResponderRelease: e => {
          if (mode === 'erase') {
            return;
          }
          setStrokes(prev => (current.length ? [...prev, current] : prev));
          setCurrent([]);
        },
      }),
    [current, mode],
  );

  return (
    <SafeAreaView>
      <Header></Header>
      <SketchPad
        mode={mode}
        strokes={strokes}
        panResponder={panResponder}
        current={current}
        sketchRef={sketchRef}
      ></SketchPad>
      <ToolBar
        handleMode={handleMode}
        refresh={refresh}
        handleSearch={handleSearch}
      ></ToolBar>
    </SafeAreaView>
  );
}
