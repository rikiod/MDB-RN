import React, { useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";

import { styles } from "../constants/Styles";
import { nameToPic } from "../constants/Constants";
import { useEffect } from "react";
import { shuffle } from "../utils/ArrayUtils";
const names = Object.keys(nameToPic);

export default function GameScreen() {
  // TODO:  Declare and initialize state variables here, using "useState".

  // State for the timer is handled for you.
  const [timeLeft, setTimeLeft] = useState(5000);
  const [correctScore, setCorrectScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeUp, fetchNext] = useState(false);

  const [options, fetchOptions] = useState([]);
  const [correctName, fetchName] = useState("");
  const [correctImg, fetchImg] = useState();

  // Called by the timer every 10 seconds
  const countDown = () => {
    if (timeLeft > 0) {
      // Time still left, so decrement time state variable
      setTimeLeft(timeLeft - 10);
    } else {
        setTimeLeft(0);
        fetchNext(true);
      // Time has expired
      // TODO: update appropriate state variables
    }
  };

  // This is used in the useEffect(...) hook bound on a specific STATE variable.
  // It updates state to present a new member & name options.
  const getNextRound = () => {
    // Fetches the next member name to guess.
    
    let correct = names[Math.floor(Math.random() * names.length)];
    let correctName = nameToPic[correct][0];
    let correctImage = nameToPic[correct][1];

    // Generate 3 more wrong answers.
    let nameOptions = [correctName];
    while (nameOptions.length < 4) {
      let wrong = names[Math.floor(Math.random() * names.length)];
      let wrongName = nameToPic[wrong][0];
      if (!nameOptions.includes(wrongName)) {
        nameOptions.push(wrongName);
      }
    }
    nameOptions = shuffle(nameOptions);

    // TODO: Update state here.
    
    fetchNext(false);

    setTimeLeft(5000);

    fetchOptions(nameOptions)
    fetchName(correctName)
    fetchImg(correctImage)
  };

  // Called when user taps a name option.
  // TODO: Update correct # and total # state values.
  const selectedNameChoice = (index) => {
    if (options[index] === correctName) {
      setCorrectScore(1 + correctScore);
      fetchNext(true);
    } 
    setTotalScore(1 + totalScore);
  };

  // Call the countDown() method every 10 milliseconds.
  useEffect(() => {
    const timer = setInterval(() => countDown(), 10);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  // TODO: Finish this useEffect() hook such that we automatically
  // get the next round when the appropriate state variable changes.
  useEffect(
    () => {
      getNextRound();
    },
    [
      /* TODO: Your State Variable Goes Here */
      timeUp
    ]
  );

  // Set up four name button components
  const nameButtons = [];
  for (let i = 0; i < 4; i++) {
    const j = i;
    nameButtons.push(
      // A button is just a Text component wrapped in a TouchableOpacity component.
      <TouchableOpacity
        key={j}
        style={styles.button}
        onPress={() => selectedNameChoice(j)}
      >
        <Text style={styles.buttonText}>
          {/* TODO: Use something from state here. */}
          {options[i]}
        </Text>
      </TouchableOpacity>
    );
  }

  const timeRemainingStr = (timeLeft / 1000).toFixed(2);

  // Style & return the view.
  return (
    <View style={styles.container}>
      {/* TODO: Build out your UI using Text and Image components. */}
      {/* Hint: What does the nameButtons list above hold? 
          What types of objects is this list storing?
          Try to get a sense of what's going on in the for loop above. */}
      <View>
      <Text style={styles.scoreText}> Current Score: {correctScore}/{totalScore} </Text>
      <Text style={styles.timerText}> Time Remaining: {timeRemainingStr} </Text>
      <View style={styles.imageView}>
        <Image
          source={correctImg}
          style={styles.image}
        />
      </View>
      {nameButtons.map((item)=>{return item})}
      </View>
    </View>
  );
}
