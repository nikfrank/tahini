import { By, until } from 'selenium-webdriver';

export default driver=>{

  // IRL these will be a wee bit more complicated than this.
  const elements = {
    todoItems: By.css('ul li'),
    textInput: By.css('input'),
    addButton: By.css('button')
  };
  const url = 'http://localhost:3000/#/todo-list';

  // IRL these can be composite actions (ie addTodo: ()=>{ typeText(text); clickAddButton(); }
  return {
    elements,
    navigate: ()=> driver.navigate().to(url),
    getTodoItems: ()=> driver.findElements(elements.todoItems),
    typeText: text=> driver.findElement(elements.textInput).sendKeys(text),
    clickAddButton: ()=> driver.findElement(elements.addButton).click()
  };
};
