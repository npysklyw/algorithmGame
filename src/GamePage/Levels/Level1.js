import React, { useEffect, useState } from 'react';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import './Level1.css';
import Steps from './Steps.json'

export default function Level1() {
    
    const colours = ["#ff4444", "#00c851", "#ffbb33", "#33b5e5"] //red, green, yellow, light blue

    const [ index, setIndex ] = useState(1);
    const [ blocks, setBlocks ] = useState(Steps["Rules"]["TutorialArray"]);
    const steps = Steps["Rules"]["MergeSort"];
    const [ step, setStep ] = useState(steps[`${index}`]);
    const [ ranges, setRanges ] = useState([]);
    const [ nextDisable, setNextDisable ] = useState(false);
    const [ prevDisable, setPrevDisable ] = useState(false);

    const [width, setWidth] = useState(
        Math.min(20, Math.ceil(window.innerWidth / blocks.length) - 8)
    );
    
    const color = blocks.length <= 50 && width > 14 ? 'black' : 'transparent';

    useEffect(() => {

        //setting displayed step as the initial step from the json file
        setStep(steps[`${index}`]);

        if (!step)
            setStep(steps['0']);

        setRanges(step.range);

        setWidth(
            Math.min(20, Math.ceil(window.innerWidth / blocks.length) - 8)
        );

        if (step.array) {
            setBlocks(step.array);
        }

        handleDisable();

        
        console.log(index, step.array, step.Description);
        
    }, [index, []])

    useEffect(() => {
        renderRanges();
    }, [ranges])

    function renderRanges()   {

        let stack = [];
        ranges.forEach((item, i) => {
            
            let min = item[0];
            let max = item[1] ? item[1] : min;
            console.log(i);
            console.log(colours[i]);
            blocks.forEach((block, j)  =>  {

                if (min <= j && j <= max) {
                    document.getElementById('block-' + j).style.backgroundColor = `${colours[i]}`;
                    stack.push(j);
                }
            });
        });

        blocks.forEach((block, x) => {
            if (!stack.includes(x))
                document.getElementById('block-' + x).style.backgroundColor = "turquoise";
        })
    }
    
    function handleNext()  {
        setIndex(index+1);
        console.log(index);
        
    }

    function handlePrev()   {
        console.log(index);
        setIndex(index - 1);
    }

    function handleDisable()    {
        if (index === 22)   {
            setNextDisable(true);
        } else {
            setNextDisable(false);
        }

        if (index === 1)    {
            setPrevDisable(true);
        } else {
            setPrevDisable(false);
        }
}
    

    return (
        <div className='tutorial-div'>
                <div className="steps-div">
                
                    <div className='step-label-div'>
                        <label className='step-label'>{step ? step.Description ? step.Description : undefined : undefined}</label>
                    </div>

                    <div className='prev-next-container'>
                        <button disabled={prevDisable} onClick={handlePrev}><FaAngleLeft /></button>
                        <button disabled={nextDisable} onClick={handleNext}><FaAngleRight /></button>
                    </div>
                </div>
                
                    <ul className="list">
                        {blocks.map((block, i) => {
                            const height = ((block * 500) / blocks.length) + 10;
                            let bg = 'turquoise';
                            const style = {
                                backgroundColor: bg,
                                'color': color, 
                                'height': height, 
                                'width': width
                            }

                            return (<div key={i} id={'block-' + i} className='block' style={style}>{block}</div>);

                        })}
                    </ul>
        </div>
    );
}