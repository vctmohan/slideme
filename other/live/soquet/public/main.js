function render(data) {  
    var html = data.map(function(elem, index){
        return(`<div>
                 <strong>${elem.author}</strong>:
                 <em>${elem.text}</em>
        </div>`)
    }).join(" ");

    document.getElementById('messages').innerHTML = html;
}

var socket = io.connect('http://localhost:8080', { 'forceNew': true });

socket.on('messages', function(data) {  
    render(data);
});
