import "./productCard.css";

export default function ProductCard() {
  return (
    <div className="card">
      <img src={require("../../../img/shuro.png")} />
      <p className="product__description">
        Дрель-шуруповерт аккумуляторный 12V 2х2,0Ач Li-ion 15Нм реверс кейс ЗУБР
      </p>
      <p className="price">
        <b>800 ₽ / шт</b>
      </p>
    </div>
  );
}
