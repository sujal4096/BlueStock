document.addEventListener('DOMContentLoaded', function () {

    let currentPage = 1, searchQuery = '', totalPages = 1;
    let nextPage = prevPage = null;
    const p = [1,2,3,4];
    const apiUrl = 'http://127.0.0.1:8000/api/adminipolistings/';
    
    function changePage(page) {
        if (page === 'prev' && prevPage) 
            fetchData(prevPage);
        else if (page === 'next' && nextPage) 
            fetchData(nextPage);
        else if (page !== currentPage) 
            fetchData(`${apiUrl}?search=${searchQuery}&page=${parseInt(page, 10)}`);
    }

    fetchData(apiUrl);
    const ipoListingContainer = document.getElementById('taba');

    function fetchData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                ipoListingContainer.innerHTML = '';

                if (data.results.length === 0) {
                    ipoListingContainer.innerHTML = '<tr><td colspan="10" class="no-result">No IPO listings found.</td></tr>';
                    return;
                }            

                nextPage = data.next;
                prevPage = data.previous;
                currentPage = new URL(url).searchParams.get('page') || 1;
                totalPages = Math.ceil(data.count/4);
                const fragment = document.createDocumentFragment();

                data.results.forEach(ipo => {
                    const ipoItem = document.createElement('tr');
                    ipoItem.classList.add('row');
                    const ipoDetails = `
                        <td class="cen">${ipo.company_name}</td>
                        <td class="lef">${ipo.price_band}</td>
                        <td class="cen">${ipo.open_date || 'Not Issued'}</td>
                        <td class="cen">${ipo.close_date || 'Not Issued'}</td>
                        <td class="cen">${ipo.issue_size}</td>
                        <td class="cen">${ipo.issue_type}</td>
                        <td class="cen">${ipo.listing_date || 'Not Issued'}</td>
                        <td class="cen"><span class='${ipo.status}'>${ipo.status}</span></td>
                        <td class="cen">
                            <button class="action-btn">
                                Update
                            </button>
                        </td>
                        <td class="cen">
                            <button class="icon-btn delete" data-id="${ipo.id}">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                            <button class="icon-btn view">
                                <i class="bi bi-eye custom-eye-icon"></i>
                            </button>
                        </td>
                    `;

                    ipoItem.innerHTML = ipoDetails;
                    ipoListingContainer.appendChild(ipoItem);

                    // Delete button event listener
                    const deleteButton = ipoItem.querySelector('.delete');
                    deleteButton.addEventListener('click', function () {
                        if (confirm('Are you sure you want to delete this IPO Listing?')) {
                        const id = this.getAttribute('data-id');
                        fetch(`${apiUrl}${id}/`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRFToken': getCookie('csrftoken')
                            }
                        })
                            .then(response => {
                                if (response.ok) {
                                    alert('IPO Listing deleted successfully!');
                                    ipoItem.remove();
                                    location.reload();
                                } 
                                else 
                                    alert('Failed to delete IPO Listing.');
                                deleteButton.disabled = false;
                            })
                            .catch(error => {
                                console.error('Error deleting IPO Listing:', error);
                            });
                        }
                    });
                    fragment.appendChild(ipoItem); 
                });

                ipoListingContainer.appendChild(fragment); 
                updatePaginationButtons();
            })
            .catch(error => {
                console.error('Error fetching IPO data:', error);
            });
    }

    function updateButton(button, condition, action) {
        button.classList.toggle('button-impossible', !condition);
        button.classList.toggle('button-possible', condition);
        button.disabled = !condition;
        button.onclick = condition ? () => changePage(action) : null;
    }

    function updatePaginationButtons() {
        const backButton = document.querySelector('.back-arrow');
        const nextButton = document.querySelector('.next-arrow');
        const pageButtons = document.querySelectorAll('.page-number-button');

        updateButton(backButton, prevPage, 'prev');
        updateButton(nextButton, nextPage, 'next');
        
    if(totalPages>3){
        p[2]= totalPages-1;
        p[3]=totalPages;

        if(currentPage != 1 && currentPage != totalPages)
        { 
            if(currentPage == totalPages - 2)
            {
               p[0]=parseInt(currentPage,10)-1;
               p[1]=currentPage;
               
            }
            else if(currentPage < totalPages - 2)
            {
                p[0]=currentPage;
                p[1]=parseInt(currentPage,10)+1;
                
            }
            else{
                p[0]=1;
                p[1]=2;
            }
        }
        else{
            p[0]=1;
            p[1]=2;
        }
    }
    else{
        if(totalPages<=3) document.getElementById("pg-bt-4").disabled = true;
        if(totalPages<=2) document.getElementById("pg-bt-3").disabled = true;
        if(totalPages<=1) document.getElementById("pg-bt-2").disabled = true;
    }
        document.querySelectorAll('.page-number-button').forEach((button, index) => {
            button.textContent = p[index];
        });
        
         pageButtons.forEach(button => {
            const pageNumber = parseInt(button.textContent, 10);
            if (pageNumber === parseInt(currentPage,10)) 
                button.classList.add('active');
            else 
                button.classList.remove('active');
        });
 
    }

    // document.querySelectorAll('.back-arrow, .next-arrow').forEach(button => {
    //     button.addEventListener('click', () => {
    //         console.log('Button clicked:', button.classList);
    //     });
    // });

    document.querySelectorAll('.page-number-button').forEach((button, index) => {
        button.textContent = p[index];
        button.addEventListener('click', function () {
            const pageNumber = parseInt(this.textContent, 10);
            changePage(pageNumber);
        });
    });

    const closeButton = document.getElementById('close-button');
    function handleSearch() {
        var searchQuery = document.getElementById("search-input").value;
        fetchData(`${apiUrl}?search=${searchQuery}`);
        closeButton.style.display = 'inline-block';
    }

    document.getElementById("search-button").addEventListener("click", handleSearch);
    document.getElementById("search-input").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); 
            handleSearch();
        }
    });

    closeButton.addEventListener('click', function () {
        document.getElementById("search-input").value='';
        closeButton.style.display = 'none';
        fetchData(apiUrl);
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});

document.querySelector('.dashboard').addEventListener('click', () => {
    window.location.href = '/adminwebapp/admin-dashboard';
});
document.querySelector('.register-btn').addEventListener('click', () => {
    window.location.href = '/adminwebapp/register-ipo';
});