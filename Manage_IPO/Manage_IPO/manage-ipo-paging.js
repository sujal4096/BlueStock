function updatePaginationButtons(currentPage, totalPages) {
    // Get pagination buttons
    const paginationContainer = document.querySelector('.pagination');

    // Update the back arrow button
    const backButton = paginationContainer.querySelector('.back-arrow');
    if (currentPage <= 1) {
        backButton.classList.add('button-impossible');
        backButton.classList.remove('button-possible');
    } else {
        backButton.classList.add('button-possible');
        backButton.classList.remove('button-impossible');
        backButton.onclick = () => fetchIpoListings(currentPage - 1);
    }

    // Update the next arrow button
    const nextButton = paginationContainer.querySelector('.next-arrow');
    if (currentPage >= totalPages) {
        nextButton.classList.add('button-impossible');
        nextButton.classList.remove('button-possible');
    } else {
        nextButton.classList.add('button-possible');
        nextButton.classList.remove('button-impossible');
        nextButton.onclick = () => fetchIpoListings(currentPage + 1);
    }

    // Remove existing page buttons
    const pageButtons = Array.from(paginationContainer.querySelectorAll('.page-button:not(.back-arrow):not(.next-arrow)'));
    pageButtons.forEach(button => button.remove());

    // Add page buttons
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(totalPages, maxPagesToShow);
    } else if (currentPage > totalPages - 2) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('page-button');
        pageButton.innerText = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        } else {
            pageButton.onclick = () => fetchIpoListings(i);
        }
        paginationContainer.appendChild(pageButton);
    }

    // "..." for skipped pages
    if (endPage < totalPages - 1) {
        const dotsButton = document.createElement('button');
        dotsButton.classList.add('page-button');
        dotsButton.innerText = '...';
        paginationContainer.appendChild(dotsButton);
    }

    // Last page button
    if (endPage < totalPages) {
        const lastPageButton = document.createElement('button');
        lastPageButton.classList.add('page-button');
        lastPageButton.innerText = totalPages;
        lastPageButton.onclick = () => fetchIpoListings(totalPages);
        paginationContainer.appendChild(lastPageButton);
    }
}
