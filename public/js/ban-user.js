(function ($) {
    "use strict"

    const buttons = document.getElementsByClassName('toastr-info-top-right')
    Array.from(buttons).forEach(entry => {
        entry.addEventListener("click", function (e) {
            const options = {
                positionClass: "toast-top-right",
                timeOut: 5e3,
                closeButton: !0,
                debug: !1,
                newestOnTop: !0,
                progressBar: !0,
                preventDuplicates: !0,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut",
                tapToDismiss: !1
            }
            const button = e.target
            const { userName, userId } = button.dataset
            const statusSpan = document.getElementById(userId)
            const action = button.innerText.toLowerCase()
            $.ajax({
                url: '/users/' + action,
                method: 'POST',
                data: { target: userId },
                success: (result) => {
                    if (action == 'ban') {
                        statusSpan.innerText = 'banned'
                        statusSpan.classList.remove('badge-success')
                        statusSpan.classList.add('badge-danger')
                        toastr.warning(`User ${userName} banned`, "Warning", options)
                        button.innerText = 'Unban'
                        button.classList.remove('btn-outline-danger')
                        button.classList.add('btn-outline-success')
                    }
                    else {
                        statusSpan.innerText = 'activated'
                        statusSpan.classList.remove('badge-danger')
                        statusSpan.classList.add('badge-success')
                        toastr.info(`User ${userName} unbanned`, "Warning", options)
                        button.innerText = 'Ban'
                        button.classList.remove('btn-outline-success')
                        button.classList.add('btn-outline-danger')
                    }
                },
                error: (error) => {
                    toastr.error(error.responseText, "Error", options)
                }
            })

        });
    })

})(jQuery);