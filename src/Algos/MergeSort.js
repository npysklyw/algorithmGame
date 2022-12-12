let order = [];
let steps = [];

const merge = (numbers, left, mid, right) =>{
    let i = left
    let j = mid + 1;

    const arr = [];

    // Checking if i is less then mid and j is less then right
    while((i <= mid) && (j <= right))
    {
        order.push([i,j,null,null])
        if(numbers[i] <= numbers[j])
        {
            arr.push(numbers[i++])
        }
        else
        {
            arr.push(numbers[j++])
        }
    }

    while(i <= mid){
        order.push([i, null, null, null])
        arr.push(numbers[i++])
    }

    while(j <= right){
        order.push([null, j, null, null])
        arr.push(numbers[j++])
    }
    
    for(i=left; i<=right; i++){
        numbers[i] = arr[i - left]
        order.push([i, null, numbers.slice(), null]) 
    }
}

const mergeHelper = (numbers, left, right) => {
    if(left >= right) 
        return 
    
    const mid = Math.floor((left + right) / 2)

    mergeHelper(numbers, left, mid)
    mergeHelper(numbers, mid + 1, right) 

    
    steps.push([left, right]);
    //steps.push([mid + 1, right]);
    
    merge(numbers, left, mid, right)
}

const mergeSort = (numbers, stepNum) => {
    order = []
    steps = [];
    const dupNumbers = numbers.slice() // copying numbers array
    
    mergeHelper(dupNumbers, 0, dupNumbers.length - 1)
    
    for(let i=0;i<dupNumbers.length;i++){
        order.push([null, null, null, i]) // i moved to the correct position
    }

    return steps[stepNum];
}

export default mergeSort