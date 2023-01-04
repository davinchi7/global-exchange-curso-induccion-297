setTimeout(() => {
    $('.js-caja-img').show().addClass('animate__slideInDown');
    $(".js-caja-img").css("display","flex");
}, 2000);
setTimeout(() => {
    $('.js-img-1').addClass('animate__animated animate__flash animate__slow animate__infinite');
}, 3000);

for (let i = 0; i <= 3; i++){
    $('.js-img-' + i +'').on('click', () => {
        $('.js-img-' + i +'').removeClass('animate__animated animate__flash animate__slow animate__infinite');
        $('.js-img-' + (i + 1) +'').addClass('animate__animated animate__flash animate__slow animate__infinite');
        $('.js-cifra-' + i +'').addClass('animate__animated animate__slideInRight');
        $('.js-cifra-' + i +'').css("display","flex");

    });
}
$('.js-img-3').on('click', () => {
    window.parent.document.getElementById('btnSig').style.display = 'block';
});
