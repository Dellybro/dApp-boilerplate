import { createTheme } from '@mui/material/styles';

// const palette = {};
// Object.keys(AppColors).forEach((key) => {
//     palette[key] = { main: AppColors[key], contrastText: '#fff' };
// });

const { breakpoints } = createTheme({});

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#3988B1',
        },
        secondary: {
            main: '#f7f8fa',
        },
    },
    typography: {
        /** Normal */
        h1: {
            fontSize: 48,
            [breakpoints.down('sm')]: {
                fontSize: 29,
            },
        },
        h2: {
            fontSize: 36,
            [breakpoints.down('sm')]: {
                fontSize: 24,
            },
        },
        h3: {
            fontSize: 32,
            [breakpoints.down('sm')]: {
                fontSize: 24,
            },
        },
        h4: {
            fontSize: 26,
            [breakpoints.down('sm')]: {
                fontSize: 22,
            },
        },
        h5: {
            fontSize: 22,
            [breakpoints.down('sm')]: {
                fontSize: 18,
            },
        },
        h6: {
            fontSize: 20,
            [breakpoints.down('sm')]: {
                fontSize: 17,
            },
        },
        font1: {
            fontSize: 18,

            display: 'block',
            [breakpoints.down('sm')]: {
                fontSize: 16,
            },
        },

        font2: {
            fontSize: 16,

            display: 'block',
            [breakpoints.down('sm')]: {
                fontSize: 15,
            },
        },
        font3: {
            fontSize: 14,
            fontWeight: 200,

            display: 'block',
            [breakpoints.down('sm')]: {
                fontSize: 13,
            },
        },
        font4: {
            fontSize: 12,

            display: 'block',
            [breakpoints.down('sm')]: {
                fontSize: 11,
            },
        },
        font5: {
            fontSize: 11,

            display: 'block',
            [breakpoints.down('sm')]: {
                fontSize: 10,
            },
        },
    },

    components: {
        MuiButton: {
            styleOverrides: {},
        },
    },
});

export default theme;
