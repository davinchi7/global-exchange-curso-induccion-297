setTimeout(() => {
    $('.js-mision').addClass('animate__animated animate__flash animate__slow animate__infinite');
    
}, 2000);

$('.js-mision').on('click', () => {
    $('.js-text-1').show().addClass('animate__slideInDown');
    $('.js-mision').removeClass('animate__animated animate__flash animate__slow animate__infinite');
    $('.js-vision').addClass('animate__animated animate__flash animate__slow animate__infinite');
});
$('.js-vision').on('click', () => {
    $('.js-text-2').show().addClass('animate__slideInDown');
    $('.js-vision').removeClass('animate__animated animate__flash animate__slow animate__infinite');
});

window.parent.document.getElementById('btnSig').style.display = 'block';