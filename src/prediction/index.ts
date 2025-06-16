import { dataset } from "./dataset_500";
import * as tf from '@tensorflow/tfjs'
import dotenv from 'dotenv'

// .config
dotenv.config()
// .tokenization
const TecMap = {
  "Pomodoro": 0,
  "GTD": 1,
  "Eisenhower": 2,
  "Time Blocking": 3,
  "Kanban": 4,
  "2-Minute Rule": 5
}
const compMap = {
  "Simples": 0,
  "Moderada": 1,
  "Complexa": 2
}
const UrgencyMap = {
  "Alta": 0,
  "Média": 1,
  "Baixa": 2
}
const OcupationMap = {
  "Estudante": 0,
  "Trabalhador": 1,
  "Desempregado": 2,
}

const xTrain = tf.tensor2d(
  dataset.map((d) => [
    d.tempo / 100,
    UrgencyMap[d.urgencia as keyof typeof UrgencyMap],
    compMap[d.complexidade as keyof typeof compMap],
    OcupationMap[d.ocupacao as keyof typeof OcupationMap],
  ])
);

const yTrain = tf.oneHot(
  tf.tensor1d(dataset.map(d => TecMap[d.tecnica as keyof typeof TecMap]), 'int32'), 6
);
// .model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [4] }));
model.add(tf.layers.dense({ units: 6, activation: 'softmax' }));

model.compile({
  optimizer: tf.train.adam(0.001),
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
});

// .Training  
async function train() {
  await model.fit(xTrain, yTrain, {
    epochs: 100,
    batchSize: 32,
    validationSplit: 0.2,
  });
  //await saveTojson(model)
  const url = process.env.SaveUrl as string
  await model.save(url)
  console.log("Model trained!");
}
// .prediction
/**This function use a ML to predict what kinda tecnic of time manegiment should you use to increase your productivity
 * 
 * @param {Number} tempo the time that you have to do the Job/task
 * @param {string} urgencia the urgency of the task/job , can be : Alta ,Média ,Baixa
 * @param {string} complexidade the complexity of the task ,can be : Simples ,Moderada ,Complexa 
 * @param {string} ocupacao this param describe your occupation , it also can be : Estudante , Desempregado , Trabalhador
 * @returns {Object} returns the Tecnic that you should use to improve your productivity and get the job done easilly
 */
export async function Predict(tempo: number, urgencia: string, complexidade: string, ocupacao: string) {

  const input = await tf.tensor2d([[
    tempo / 100,
    UrgencyMap[urgencia as keyof typeof UrgencyMap],
    compMap[complexidade as keyof typeof compMap],
    OcupationMap[ocupacao as keyof typeof OcupationMap],
  ]]);
  try {
    const url = process.env.LoadUrl as string
    const model = await tf.loadLayersModel(url);
    const predicao = model.predict(input) as tf.Tensor;
    const ID = await predicao.dataSync()
    const tecnicas = ["Pomodoro", "GTD", "Eisenhower", "Time Blocking", "Kanban", "2-Minute Rule"];
    const indice = ID.indexOf(Math.max(...ID));
    return {
      tec: tecnicas[indice],
      scores: ID,
      id: indice
    };
  } finally {
    input.dispose()
  }
}
/*
train().then(async () => {
  //const res = await Predict(80, "Alta", "Complexa", "Trabalhador") //console.log("result : ", res)
  console.log("Trained very well")
}).catch((error) => {
  console.log(error.message)
});*/