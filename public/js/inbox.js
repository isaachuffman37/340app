function buildMessageList(data) { 
    let inventoryDisplay = document.getElementById("inboxDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Message Subject</th><th>From</th><th>Date Created</th><th>Read Status</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all messages in the array and put each in a row 
    data.forEach(function (element) { 
        console.log(element.message_id + ", " + element.message_subject); 
        dataTable += `<tr>`; 
        // Display message subject as a link 
        dataTable += `<td><a href='/messages/details/${element.message_id}' title='Click to view message details'>${element.message_subject}</a></td>`; 
        // Display sender (message_from) as sender name (replace with actual name if needed)
        dataTable += `<td>${element.message_from}</td>`; 
        // Display message creation date
        dataTable += `<td>${new Date(element.message_created).toLocaleString()}</td>`; 
        // Display message read status (True or False)
        dataTable += `<td>${element.message_read ? 'Read' : 'Unread'}</td>`; 
        dataTable += '</tr>'; 
    }) 
    dataTable += '</tbody>'; 
    // Display the contents in the Message Management view 
    inventoryDisplay.innerHTML = dataTable; 
}
