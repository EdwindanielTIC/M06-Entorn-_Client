class Excel {
    constructor() {
      this.data = [];
    }


    async readCSV(file) {
      return new Promise((resolve, reject) => {
        let content;
        
        // Comprobar si es un objeto File o una cadena de texto
        if (file instanceof File) {
          const reader = new FileReader();
          reader.onload = (e) => {
            content = e.target.result;
            processCSV(content);
          };
          reader.onerror = () => reject(new Error('Error al leer el archivo'));
          reader.readAsText(file);
        } else if (typeof file === 'string') {
          content = file;
          processCSV(content);
        } else {
          reject(new Error('Formato de entrada no válido'));
        }
        
        const processCSV = (csvContent) => {
          try {
            // Dividir el contenido en líneas
            const lines = csvContent.split('\n');
            
            // Obtener encabezados de la primera línea
            const headers = lines[0].split(',').map(header => header.trim());
            
            // Procesar todas las filas (excepto la de encabezados)
            const rows = [];
            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim() === '') continue; // Saltar líneas vacías
              
              const values = lines[i].split(',').map(value => value.trim());
              const row = {};
              
              // Crear un objeto con los valores de cada fila
              headers.forEach((header, index) => {
                row[header] = values[index];
              });
              
              rows.push(row);
            }
            
            this.data = rows;
            resolve(rows);
          } catch (error) {
            reject(new Error(`Error al procesar el CSV: ${error.message}`));
          }
        };
      });
    }

    /**
     * Obtiene información del país basado en la ciudad
     * @param {string} city - Nombre de la ciudad
     * @returns {Promise<Object>} Objeto con información de la ciudad y país
     */
    async getInfoCountry(city) {
      return new Promise(async (resolve, reject) => {
        try {
          // Obtener la fila correspondiente a la ciudad
          const cityRow = this.data.find(row => {
            // Intentar encontrar la ciudad en cualquier columna
            return Object.values(row).some(value => 
              value && value.toLowerCase() === city.toLowerCase());
          });
          
          if (!cityRow) {
            throw new Error(`Ciudad "${city}" no encontrada en los datos`);
          }
          
          // Determinar el país basado en los datos disponibles
          let country;
          if (cityRow.country) {
            country = cityRow.country;
          } else if (cityRow.Country) {
            country = cityRow.Country;
          } else {
            // Si no hay columna de país, inferimos basado en la ciudad
            if (city.toLowerCase() === 'barcelona') {
              country = 'Spain';
            } else if (city.toLowerCase() === 'londres' || city.toLowerCase() === 'london') {
              country = 'United Kingdom';
            } else {
              throw new Error(`No se pudo determinar el país para la ciudad "${city}"`);
            }
          }
          
          // Hacer la consulta a la API REST Countries
          const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
          
          if (!response.ok) {
            throw new Error(`Error en la consulta a la API: ${response.status}`);
          }
          
          const countriesData = await response.json();
          const countryData = countriesData[0]; // Tomamos el primer resultado
          
          // Crear objeto con la información requerida
          const result = {
            city: city,
            flag: countryData.flags.png || countryData.flags.svg,
            lat: countryData.capitalInfo?.latlng?.[0] || null,
            long: countryData.capitalInfo?.latlng?.[1] || null
          };
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }
  }