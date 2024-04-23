$(document).ready(function () {
    // CAPTURAR EVENTO
    $('#btnSend').on('click', (event) => {
        event.preventDefault();
        // SE DEFINEN TÉRMINOS PARA VALIDACIÓN A TRAVÉS DE REGEX
        const regexValidacion = /^[0-9]+$/i;
        let idSuperHero = $('#heroSearch').val();
        // CICLO PARA VALIDACIÓN DE ID INGRESADO POR USUARIO
        if (regexValidacion.test(idSuperHero) && idSuperHero < 732 && idSuperHero > 0) {
            getHero(idSuperHero);
        } else {
            failRegex(idSuperHero)
        };

    })
    // CONSULTAR API A PARTIR DE ID INGRESADO Y VALIDADO
    const getHero = (idSuperHero) => {

        $.ajax({
            type: 'GET',
            url: 'https://www.superheroapi.com/api.php/3525635500807579/' + idSuperHero,
            contentType: 'application/json',
            dataType: 'json',
            success: (data) => {
                if (data != undefined || data != null) {
                    renderData(data);
                }else if (data == null || data == undefined) {
                alert('No se encontraron datos');
                return;
                }
            },
            error: (error) => {
                console.log('Error, data llegó sin datos')
            }
        });
    }

    // RENDERIZAR LA INFORMAIÓN RECIBIDA POR LA API 
    const renderData = (data) => {
        console.log(data)
        
        $('#heroSearch').val('')
        dataGraph(data)

        // CAPTURA DE DATOS DE LA API PARA LA TARJETA DINÁMICAMENTE
        $('#card-title').text(`Nombre: ${data.name}`)
        $('#card-img').attr('src', data.image.url)
        $('#card-info').text(data.connections['group-affiliation'])
        $('#card-info-1').text(`Publicado por: ${data.biography.publisher}`)
        $('#card-info-2').text(`Ocupación: ${data.work.occupation}`)
        $('#card-info-3').text(`Primera aparición: ${data.biography['first-appearance']}`)
        $('#card-info-4').text(`Altura: ${data.appearance.height}`)
        $('#card-info-5').text(`Peso: ${data.appearance.weight}`)
        $('#card-info-6').text(`Alianzas: ${data.biography.aliases}`
        )
        $('#card-show').removeClass('d-none')
    }

    // ORDENAR DATOS PARA GRÁFICO
    const dataGraph = (data) => {
        let { powerstats:stats } = data;
        const powerstats = data.powerstats;

        const statsdata = [];
        for (const key in powerstats) {
            statsdata.push({ label: key, y: Number(powerstats[key]) ?? 20 })
        }
        // OBTENER GRÁFICO DE BARRAS CANVASJS
        let chart = new CanvasJS.Chart("graphContainer", {
            animationEnabled: true,
            title: {
                text: `Estadisticas de Poder para ${data.name}`
            },
            data: [{
                type: "bar",
                dataPoints: statsdata
            }]
        });
        return chart.render();
    }

    // MODALS PARA MOSTRAR ERRORES DE VALIDADCIÓN
    const failRegex = (idSuperHero) => {
        $('#modalLabel').text(`El Héroe con id: ${idSuperHero} no existe`);
        $('#exampleModal').modal('show');
        $('#modalBody').text(`Por favor introduce un ID numérico válido y menor a 732`);
        $('#heroSearch').val('');
        console.log('Error al capturar datos por fracaso de validación en regex ')
    }
})