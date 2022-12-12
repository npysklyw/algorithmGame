import React, { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaHeart } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import 'antd/dist/antd.css';
import { Modal, Button } from 'antd';
import CorrectSteps from './CorrectSteps.json'
import "./listBlock.css";
import Timer from "../../GenPage/Timer";
import { notification } from "antd";
import useSound from "use-sound";
import ErrorSound from '../../Sounds/error.mp3';
import WinSound from '../../Sounds/win.mp3';

function Level5({ blocks, steps, countUp, countDown, algorithm, level,  refreshLevel }) {
    const [width, setWidth] = useState(
    Math.min(20, Math.ceil(window.innerWidth / blocks.length) - 5)
  );
  const [list, setList] = useState(blocks);
  const [current, setCurrent] = useState([]); //The blocks the user should be highlighting
  const [outOfPlace, setOutOfPlace] = useState([]); //The array that stores the values of the blocks that are out of place
  const [currentStepValid, setCurrentStepValid] = useState(false);
  const [changes,setChanges] = useState([]);
  const [won, setWon] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [life1, setLife1] = useState(true);
  const [life2, setLife2] = useState(true);
  const [life3, setLife3] = useState(true);
  const [visible, setVisible] = useState(false); // fucntion for popup
  const [loading, setLoading] = useState(false); // fucntion for loss popup
  const correctBlocks = CorrectSteps["Steps"]["MergeSort"]["Level5"];
  const [lost, setLost] = useState(false);


  // Sounds
  const [playWinSound] = useSound(WinSound);
  const [playErrorSound] = useSound(ErrorSound);

  const color = blocks.length <= 50 && width > 14 ? "black" : "transparent";
  let dropOrNotToDrop = false;

  useEffect(() => {
    setCurrentStepValid(false);
  }, [steps]);

  useEffect(() => {
    handleSteps();
    checkCurrentStep(list);

    if (currentStepValid) {
      notification.success({
        message: 'Hooray!',
        description: 'You got it! Click on the right arrow to move to the next step',
        placement: 'topLeft',
        duration: 3,
        maxCount: 2
      });
    }
  }, [currentStepValid]);

  useEffect(() => {
    setCurrentStepValid(false);
    setWidth(
      Math.min(20, Math.ceil(window.innerWidth / blocks.length) - 8)
    );
    setList(blocks);
    checkCurrentStep(blocks);
  }, [blocks])

  // calls the pop up after losing game
  useEffect(() => {
    if(mistakes > 2){
      setLost(true);
      showModal();
    }
  }, [mistakes])

  useEffect(() => {
    if (won) handleLevelComplete();
  }, [won]);

  useEffect(() => {
    if (completed) setWon(true);
  }, [completed])


  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
        
    // FOR EACH CHANGE then check validity, if the des
    //Check if block can be changed, if not 
    
    checkChange(result);
    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList(items);
  };

  useEffect(() => {
    checkCurrentStep(list);
  }, [list])

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
        resetLevel();
        refreshLevel();
      }
  
      // count up the step
      countUp();
    }

    //checks how many lives user has
    const checkLives = () => {
      if(mistakes === 0){
        setLife1(false)
        notification.error({
          message: 'Oops!',
          description: 'You moved the wrong tiles! Lost a life :(',
          placement: 'topLeft',
          duration: 3,
          maxCount: 2
        });
      }
      if(mistakes === 1){
        setLife2(false);
        notification.error({
          message: 'Oops!',
          description: 'You moved the wrong tiles! Lost a life :(',
          placement: 'topLeft',
          duration: 3,
          maxCount: 2
        });
      }
      if(mistakes === 2){
        setLife3(false);
        notification.error({
          message: 'Oops!',
          description: 'You moved the wrong tiles! Lost a life :(',
          placement: 'topLeft',
          duration: 3,
          maxCount: 2
        });
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
    }

  // Checks what change the user has made in terms of moving the blocks
  const checkChange = (move) => {

    let arr = outOfPlace;
    let start = move.source.index;
    let end = move.destination.index;

    
    if ((!current.includes(end) || !current.includes(end)) && end!=start) {
      arr.push(start)
      arr.push(end)
      setMistakes(mistakes + 1);
      playErrorSound(); // play error sound to indicate error
      checkLives();
    }

    if (current.includes(end)) {
      const endIndex = arr.indexOf(current[end]);
      const startIndex = arr.indexOf(current[start]);
      arr.splice(endIndex, 1);
      arr.splice(startIndex, 1);
    }

    setOutOfPlace(arr)
  };

  // functions to show pop up after losing game
  const showModal = () => {
    setVisible(true);
  };

  // things to take care of when resetting level
  function resetLevel() {
    setLife1(true);
    setLife2(true);
    setLife3(true);

    setMistakes(0);
    setLost(false);
    setCompleted(false);

    setOutOfPlace([]);
  }
  
  // functions to handle pop-up
  const handleRefresh = () => {
    resetLevel();
    refreshLevel();
    setVisible(false);
  };

  // functions to handle pop-up
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 3000);
  };

  // functions which closes pop up
  const handleCancel = () => {
    setVisible(false);
  };
  // Switches what is being stored in the current array
  function handleSteps() {
    return correctBlocks[steps] ? setCurrent(correctBlocks[steps].current) : undefined;
  }

  return (
    <div className="lvl5">
      <div className='prev-next-container'>
          <button onClick={countDown}><FaAngleLeft /></button>
          <button onClick={handleNextStep}><FaAngleRight /></button>
      </div>
      {!won ? <Timer algorithm={algorithm} level={level} completed={completed} /> : undefined}
      <div className="lives">
      <div>{life1 ? <FaHeart/> : null}</div>
      <div>{life2 ? <FaHeart/> : null}</div>
      <div>{life3 ? <FaHeart/> : null}</div> 
      </div>
      <div className="game-lost-pop-up">{visible? <Modal
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel} 
          closable = {false}
          maskClosable = {false}
          maskStyle = {{backgroundColor: "black", opacity: "0.8"}}
          width={800}
          footer={[
            <Button
              type="primary"
              loading={loading}
              onClick={handleRefresh}
            >
              Restart Level
            </Button>,
            <Button
            href="http://localhost:3000/SelectionPage"
            type="primary"
            loading={loading}
            onClick={handleOk}
            >
              Return To A Previous Level
            </Button>,
            <Button
            type="primary"
            loading={loading}
            onClick={handleRefresh}
            >
              Try Again With Another Algorithm
            </Button>,
            <Button
            href="http://localhost:3000/MenuPage"
            type="primary"
            loading={loading}
            onClick={handleOk}
            >
              Quit Game
            </Button>,
          ]}
        >
          <h1 className="pop-up-content">Oh No... You Lost All Your Lives</h1>
          <h2 className="pop-up-content">You now have the choice to:</h2>

        </Modal> : null}</div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="blocks" direction="horizontal">
          {(provided) => (
            <ul
              className="listBlocks"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {list.map((block, i) => {
                
                const height = ((block * 200) / list.length) + 10 ;
                let bg = "turquoise";

                // 
                  if (outOfPlace.includes(i)) {
                    bg="red";
                  }


                // If the user moves the correct step into order
                  if (current.includes(i) && !outOfPlace.includes(i)) {
                    bg = (currentStepValid ? '#4bc52e' : 'turquoise' )
                  }

                const style = {
                  backgroundColor: bg,
                  color: color,
                  height: height,
                  width: width,
                };
                return (
                  <Draggable
                    key={i}
                    draggableId={"" + i}
                    index={i}
                    isDragDisabled={dropOrNotToDrop} 
                  >
                  
                    {(provided) => {
                        
                        return (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div 
                          style={style}
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

export default Level5;