const express = require('express');
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.render('index', {
        error: null,
        age: null
    });
});

app.post('/', (req, res) => {
    const { year, month, day } = req.body;

    try {

        if (!year || !month || !day) {
            return res.render('index', {
                error: ["Tout les champs n'ont pas été remplies."],
                age: null,
                initial_value: {
                    year: year,
                    month: month,
                    day: day
                }
            });
        }

        const currentDate = new Date();
        const inputDate = new Date(year, month - 1, day);
        const totalDays = new Date(year, month, 0).getDate();

        const errors = [];

        if (month < 1 || month > 12) errors.push("Le mois n'est pas valide.");
        if ((day < 1 || day > 31 ) || day > totalDays) errors.push("Le jour n'est pas valide.");

        if (inputDate > currentDate) errors.push("La date est dans le futur.")

        let ageYear = currentDate.getFullYear() - year;
        let ageMonth = currentDate.getMonth() - (month - 1);
        let ageDay = currentDate.getDate() - day;

        let ageHours = currentDate.getHours();
        let ageMins = currentDate.getMinutes();
        let ageSecs = currentDate.getSeconds();

        if (ageDay < 0) {
            ageMonth -= 1;
            ageDay += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        }

        if (ageMonth < 0) {
            ageYear -= 1;
            ageMonth += 12;
        }

        if (errors.length > 0) {
            return res.render('index', {
                error: errors,
                age: null,
                initial_value: {
                    year: year,
                    month: month,
                    day: day
                }
            });
        }

        return res.render('index', {
            error: null,
            age: {
                year: ageYear,
                month: ageMonth,
                day: ageDay,
                hours: ageHours,
                minutes: ageMins,
                seconds: ageSecs
            },
            initial_value: {
                year: year,
                month: month,
                day: day
            }
        });

    } catch (e) {
        console.error(e);

        return res.render('index', {
            error: ["Une erreur est survenue."],
            age: null,
            initial_value: {
                year: year,
                month: month,
                day: day
            }
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});