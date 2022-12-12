const swap = (arr, i, j) => {
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
}

const bubbleSort = (blocks) => {

    const numbers = blocks.slice()
    const order = []

    let i, j

    for (i = 0; i < numbers.length; i++) {
        for (j = 0; j < numbers.length - i - 1; j++) {

            order.push([j, j+1, null, null])
            if (numbers[j] > numbers[j+1]) {
                swap(numbers, j, j+1)
                order.push([j, j+1, numbers.slice(), null])
            }
        }
        order.push([null, null, null, j])
    }

    return order
}

export default bubbleSort
