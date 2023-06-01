import Animated from "react-native-reanimated";

const Ring = ({ delay }) => {
  return <Animated.View style={[styles.ring]} />;
};

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: "tomato",
    borderWidth: 10,
  },
});

export default Ring;