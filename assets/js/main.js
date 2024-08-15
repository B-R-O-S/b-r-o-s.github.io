// Smooth scrolling for internal navigation links
$(document).ready(function () {
    $('a.nav-link[href*="#"]').on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            const hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top - 70
            }, 800, function () {
                window.location.hash = hash - 70;
            });
        }
    });
});
