function showWinLine(cells, color = 'red') {
    const board = document.querySelector('.board');
    const cellElements = document.querySelectorAll('.cell');

    // Clear previous win line if any
    const previousLine = document.querySelector('.win-line');
    if (previousLine) {
        previousLine.remove();
    }

    // Create the line
    const line = document.createElement('div');
    line.classList.add('win-line');
    line.style.backgroundColor = color;

    // Calculate positions
    const [firstCell, secondCell, thirdCell] = cells.map(index => cellElements[index]);
    const boardRect = board.getBoundingClientRect();
    const firstRect = firstCell.getBoundingClientRect();
    const thirdRect = thirdCell.getBoundingClientRect();

    let x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
    let y1 = firstRect.top + firstRect.height / 2 - boardRect.top;
    let x2 = thirdRect.left + thirdRect.width / 2 - boardRect.left;
    let y2 = thirdRect.top + thirdRect.height / 2 - boardRect.top;

    if (x1 === x2) {
        // Vertical line
        line.style.width = '5px';
        line.style.height = '100%';
        line.style.top = '0';
        line.style.left = `${x1 - 2.5}px`;
        line.style.transform = `translateY(0px)`;
    } else if (y1 === y2) {
        // Horizontal line
        line.style.width = '100%';
        line.style.height = '5px';
        line.style.top = `${y1 - 2.5}px`;
        line.style.left = '0';
        line.style.transform = `translateX(0px)`;
    } else {
        // Diagonal line
        line.style.width = `${Math.sqrt(Math.pow(boardRect.width, 2) + Math.pow(boardRect.height, 2))}px`;
        line.style.height = '5px';
        line.style.top = '0';
        line.style.left = '0';
        line.style.transformOrigin = '0 0';
        if (cells.includes(0) && cells.includes(4) && cells.includes(8)) {
            // Top-left to bottom-right
            const scaleFactor = 0.99; // Factor para reducir la longitud de la línea a la mitad
            line.style.width = `${Math.sqrt(Math.pow(boardRect.width, 2) + Math.pow(boardRect.height, 2)) * scaleFactor}px`;
            line.style.transform = 'rotate(45deg) translate(-5px, -5px)';
        } else if (cells.includes(2) && cells.includes(4) && cells.includes(6)) {
            // Top-right to bottom-left
            const scaleFactor = 0.98; // Factor para reducir la longitud de la línea a la mitad
            line.style.width = `${Math.sqrt(Math.pow(boardRect.width, 2) + Math.pow(boardRect.height, 2)) * scaleFactor}px`;
            line.style.transform = `rotate(-45deg) translate(-${boardRect.width * 0.69}px, ${boardRect.height * 0.69}px)`; // Move left one and a half cells, down one and a half cells
        }
    }

    // Append the line to the board
    board.appendChild(line);
}

showWinLine([2,4,6], 'red')
// showWinLine([0,1,2], 'red')
// showWinLine([0,3,6], 'red')
// showWinLine([0,4,8], 'red')