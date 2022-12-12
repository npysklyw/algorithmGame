import "./selectionPage.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Slider, Select, Image, Divider } from "antd";
import "antd/dist/antd.min.css";
import Game from "../GamePage/Game";
import levelData from '../Levels.json';
import Timeout from "./Timeout";
import { useParams } from "react-router-dom";
import { Modal, Button } from 'antd';

const { Option } = Select;

function SelectionPage() {
  // states
  const [level, setLevel] = useState(1);
  const [listSize, setListSize] = useState(levelData["levels"][`${level}`]["size"]);
  const [valRange, setValueRange] = useState(levelData["levels"][`${level}`]["max"]);
  const [clicked, setClicked] = useState(false);
  const [algo, setAlgo] = useState("mergeSort");
  const navigate = useNavigate();

  // Images used when the user is selecting an algo
  const sortImage = {
    bubbleSort: "./assets/AlgoImages/bubbleSort.png",
    quickSort: "./assets/AlgoImages/quickSort.png",
    mergeSort: "./assets/AlgoImages/bubbleSort.png",
  };

  function refreshLevel(lvl, alg) {
    setLevel(lvl ? lvl : 1);

    setAlgo(alg ? alg : "mergeSort");
  }

  useEffect(() => {
    setListSize(levelData["levels"][`${level}`]["size"]);
  }, [level]);

  useEffect(()=> {
    setValueRange(levelData["levels"][`${level}`]["max"]);
  }, [level]);

  // Function to set the difficulty
  function getDifficulty() {

    let value = level
    if (value === 1 || value === 2) {
      return "./assets/Levels/easy.png"
    }
    else if (value === 3 || value === 4) {
      return "./assets/Levels/medium.png"
    }
    else {
      return "./assets/Levels/hard.png"
    }
  }

  return (
    <div className="App">
      
      <div className="selection-div">

        <div className="submit-btn">
          <button className="btn" onClick={() => {navigate('/MenuPage')}}>
              back
          </button>
        </div>

        <p align="center" className="sign">
          Select an Algorithm
        </p>

      <div className="options-container">
            <div className="bar-left">
              <div className='algo-select'>
                <Select className="selection-box"
                  defaultValue="mergeSort"
                  value={algo ? algo : "mergeSort"}
                  onChange={(value) => {
                    console.log(value);
                    setAlgo(value);
                  }}>
                  <Option value="bubbleSort">Bubble Sort</Option>
                  <Option value="quickSort">Quick Sort</Option>
                  <Option value="mergeSort">Merge Sort</Option>
                </Select>
              </div>

              <div>
                <p className="sign">
                  Level: {level}
                </p>
                <Slider
                  style={{ width: "300px" }}
                  defaultValue={1}
                  disabled={false} 
                  min={1}
                  max={6}
                  value={level ? level : 1}
                  onChange={(value) => {
                    setLevel(value);
                  }}
                />
              </div>
            </div>
          

          <div className="barDiv">
            <p className="sign" align="center">
              Size of List: {listSize}
            </p>
            <Slider
              style={{ width: "270px" }}
              defaultValue={listSize}
              value={listSize}
              max={50}
              step={1}
              onChange={(value) => {
                setListSize(value);
              }}
              onAfterChange={() => {
                console.log("listsize = " + listSize);
              }}

              disabled={levelData["levels"][`${level}`]["tutorial"] ? true : false}
            />
            <p className="sign" align="center">
              Range of Values: 0-{valRange}
            </p>
            <Slider
              style={{ width: "270px" }}
              defaultValue={valRange}
              value={valRange}
              max={100}
              step={1}
              onChange={(value) => {
                setValueRange(value);
              }}
              onAfterChange={() => {
                console.log("valrange = " + valRange);
              }}

              disabled={levelData["levels"][`${level}`]["tutorial"] ? true : false}
            />
          </div>
        <Divider />
      </div>

      <div className="expand">
          <div className="expandDiv">
            <Game
              algorithm={algo}
              difficulty={level}
              size={listSize}
              max={valRange}
              clicked={clicked}
              refreshLevel={refreshLevel}
            />
          </div>

          <Timeout />
      </div>
      
      </div>
    </div>
  );
}

export default SelectionPage;
