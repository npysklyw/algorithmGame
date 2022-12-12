import React, { useState, useEffect } from "react";
import {unmountComponentAtNode} from 'react-dom';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import "./listBlock.css";
import useSound from 'use-sound';
import WinSound from '../../Sounds/win.mp3';
import ErrorSound from '../../Sounds/error.mp3';
import { notification } from "antd";
import CorrectSteps from './CorrectSteps.json'
import Timer from "../../GenPage/Timer";
import mergeSort from "../../Algos/MergeSort";

function Level2({ blocks, steps, countUp, countDown, algorithm, level , refreshLevel}) {
    const [width, setWidth] = useState(
    Math.min(20, Math.ceil(window.innerWidth / blocks.length) - 5)
  );
  const [list, setList] = useState(blocks);
  const [current, setCurrent] = useState([]); //Currently highlighted blue blocks
  const [currentStepValid, setCurrentStepValid] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [won, setWon] = useState(false);
  const correctBlocks = CorrectSteps["Steps"]["MergeSort"]["Level2&3"];
  const color = blocks.length <= 50 && width > 14 ? "black" : "transparent";
  let isDraggable = true;

  // sounds
  const [playWinSound] = useSound(WinSound);
  const [playErrorSound] = useSound(ErrorSound);

  useEffect(() => {
    setCurrentStepValid(false);
  }, [steps]);

  useEffect(() => {
    handleSteps();
    checkCurrentStep(list);

  }, [currentStepValid]);

  useEffect(() => {
    // send message for current step correct
    if (currentStepValid && !completed) {
      notification.success({
        message: 'Hooray!',
        description: 'You got it! Click on the right arrow to move to the next step',
        placement: 'topLeft',
        duration: 3,
        maxCount: 2
      });
    }
  }, [list]);

  useEffect(() => {
    setWidth(
        Math.min(20, Math.ceil(window.innerWidth / blocks.length) - 8)
      );
    setCurrentStepValid(false);
    setList(blocks);
    checkCurrentStep(blocks);

  }, [blocks]);

  useEffect(() => {
    if (completed) setWon(true);
  }, [completed]);

  useEffect(() => {
    if (won) handleLevelComplete();
  }, [won]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    // accomodate invalid dragging of items
    if (!current.includes(result.destination.index)) {
      playErrorSound();
      return;
    }

    const items = Array.from(list);
    console.log(items)
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList(items);
    checkCurrentStep(items);
  };

  // Switches what is being stored in the current array
  function handleSteps() {
    console.log(mergeSort(list, steps));

    const arr = mergeSort(list, steps);

    if(!arr) {
      setCompleted(true);
      return;
    }

    const min = arr[0];
    const max = arr[arr.length - 1];

    const curArr = [];
    for (let i = min; i <= max; i++) {
      curArr.push(i);
    }

    setCurrent(curArr);
  }

  function checkCurrentStep(items) {
    let array = items.slice(current[0], current[current.length - 1] + 1);

    let sortedArray = JSON.parse(JSON.stringify(array));
    sortedArray.sort((first, second) => first - second);
    let isEqual = true;

    array.forEach((item, index) => {
      if (!(sortedArray[index] === item)) {
        isEqual = false;
        return;
      }
    });

    if (isEqual) {
      setCurrentStepValid(true);
    } else {
      setCurrentStepValid(false);
    }
  }

  // function to trigger when the user wins the level
  function handleLevelComplete() {
    playWinSound();

    notification.success({
      message: 'Congrats!',
      description: 'You have successfully completed the level',
      placement: 'topLeft',
      duration: 3,
      maxCount: 2
    });

    // make modal visible and ask the user for what to do next
    handleRefresh();
  }

  // increment the step counter
  const handleNextStep = () => {
    // if the current step is not valid don't progress
    if (!currentStepValid) return;

    let complete = true;

    // check if the user completed the level
    const arrCpy = JSON.parse(JSON.stringify(blocks));
    arrCpy.sort((first, second) => first - second);

    arrCpy.forEach((item, index) => {
      if (!(list[index] === item)) {
        complete = false;
        return;
      }
    });

    if (complete) {
      setCompleted(true);
      handleRefresh();
    }

    // count up the step
    countUp();
  }

  function handleRefresh() {
    resetLevel();
    refreshLevel();
  }

  // things to take care of when resetting level
  function resetLevel() {
    setCompleted(false);
    setCurrent([]);
    setWon(false);
    setCurrentStepValid(false);
  }

  return (
    <div>
      <div className='prev-next-container'>
          <button onClick={countDown}><FaAngleLeft /></button>
          <button onClick={handleNextStep}><FaAngleRight /></button>
      </div>
      {!won ? <Timer algorithm={algorithm} level={level} completed={completed} /> : undefined}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="blocks" direction="horizontal">
          {(provided) => (
            <ul
              className="listBlocks"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {list.map((block, index) => {
                
                const height = ((block * 125) / list.length) + 10 ;
                let bg = "turquoise";

                if(current.includes(index)) {
                  bg = ( currentStepValid ? "#4bc52e" : "yellow" );
                  isDraggable = true;
                } else {
                  bg = "black";
                  isDraggable = false;
                }

                // Checking if the final array is sorted
                const checkSort = (arr) => {
                  for(let i = 0; i < arr.length; i++)
                  {
                    if(arr[i] > arr[i+1])
                      return false;
                  }
                }

                  if(steps === 7)
                  {
                    if(checkSort(list)) {
                      bg = "#4bc52e"
                      isDraggable = true;
                    }
                    console.log(steps)
                  }
                
                const style = {
                  color: color,
                  height: height,
                  width: width,
                };
                return (
                  <Draggable
                    key={index}
                    draggableId={"" + index}
                    index={index}
                    isDragDisabled={!isDraggable} 
                  >
                  
                    {(provided) => {
                        
                        return (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div
                          style={{ backgroundColor: current.includes(index) ? currentStepValid ? "#4bc52e" : "yellow" : bg || "black", ...style }}
                        >
                          {block}
                        </div>
                      </li>
                    )}}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Level2;