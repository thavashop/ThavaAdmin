window.onunload = () => {
    const data = document.getElementsByClassName('filepond--data')[0]
    const inputs = data.querySelectorAll('input[type=hidden')
    inputs.forEach(input => {
        $.ajax({
            url: '/products/image',
            method: 'DELETE',
            data: {path: input.value},
            success: (result) => load(),
            error: (error) => error('There is a problem'),
        })
    })
}