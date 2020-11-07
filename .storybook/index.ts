import { configure } from '@storybook/react';
import "../styles/fonts.css";
import "../styles/reset.css";

configure(require.context('..', true, /\.stories\.tsx$/), module);
