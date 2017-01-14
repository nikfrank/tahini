import { By, until } from 'selenium-webdriver';

import styles from '../index.css';

export default driver=>{

  // IRL these will be a wee bit more complicated than this.
  const elements = {
    devices: By.css(`div.${styles.card}`),
    activeDevices: By.css(`div.${styles.active}`),
    clickMes: By.css('input')
  };
  const url = 'http://localhost:3000/#/dashboard';

  // IRL these can be composite actions (ie addTodo: ()=>{ typeText(text); clickAddButton(); }
  return {
    elements,
    navigate: ()=> driver.navigate().to(url),
    getDevices: ()=> driver.findElements(elements.devices),
    getActiveDevice: ()=> driver.findElements(elements.activeDevices).then(aws=> aws[0]),
    activateDevice: (device)=> device.click()
  };
};
