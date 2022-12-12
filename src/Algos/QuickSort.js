let order = []

const swap = (arr, i, j) => {
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}

const partition = (numbers, left, right) => {
    const pivot = left
    let j = left

    for(let i = left + 1; i<=right;i++) {
        order.push([i, pivot, null, null])
        if(numbers[i] < numbers[pivot]){
            j+=1
            swap(numbers, i, j)
            order.push([i,j,numbers.slice(), null])
        }
    }

    swap(numbers, pivot, j)
    order.push([pivot, j, numbers.slice(), null])
    order.push([null,null,null,j])
    return j
}

const quickSortHelper = (numbers, left, right) => {
    if (left >= right) {
        if (left===right) order.push([null,null,null,left])
        return
    }

    const pivot = left + Math.floor(Math.random() * (right-1))

    swap(numbers, left, pivot)
    order.push([left, pivot, numbers.slice(), null])

    const m = partition(numbers, left, right)

    quickSortHelper(numbers, left, m-1)
    quickSortHelper(numbers, m+1, right)

    return
}

const quickSort = (blocks) => {
    const numbers = blocks.slice()
    order=[]

    quickSortHelper(numbers, 0, numbers.length -1)

    return order
}

export default quickSort