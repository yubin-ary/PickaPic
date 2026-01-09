import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';


function pointsToPath(points) {
  if (points.length === 0) return '';
  const first = points[0];
  let d = `M ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  return d;
}

const SketchPad = ({
  mode,
  strokes,
  panResponder,
  current,
  sketchRef,
  onLayout,
}) => {
  return (
    <View
      {...panResponder.panHandlers}
      style={style.sketchPadStyle}
      collapsable={false}
      ref={sketchRef}
      onLayout={onLayout}
    >
      <Svg style={StyleSheet.absoluteFill}>
        {strokes.map((pts, i) => (
          <Path
            key={i}
            d={pointsToPath(pts)}
            stroke="black"
            strokeWidth={12}
            fill="none"
          />
        ))}
        <Path
          d={mode === 'draw' ? pointsToPath(current) : null}
          stroke="black"
          fill="none"
          strokeWidth={12}
        />
      </Svg>
    </View>
  );
};
const style = StyleSheet.create({
  sketchPadStyle: {
    margin: 20,
    height: 400,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
  },
});
export default SketchPad;
