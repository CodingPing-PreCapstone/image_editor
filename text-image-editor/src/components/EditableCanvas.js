import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image, Text, Transformer } from "react-konva";
import useImage from "use-image";


const EditableCanvas = () => {
  const [image] = useImage(process.env.PUBLIC_URL + "/original.jpg"); 
  const stageRef = useRef();
  const [text, setText] = useState("더블클릭하여 편집");
  const [isEditing, setIsEditing] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const textRef = useRef();
  const transformerRef = useRef();
  const [inputValue, setInputValue] = useState("더블클릭하여 편집");
  const [fontSize, setFontSize] = useState(50);
  const [fontFamily, setFontFamily] = useState("NanumBarunGothic");
  const [textColor, setTextColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#ffffff");

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = uri;
    link.click();
  };

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTextDragEnd = (e) => {
    setTextPosition({ x: e.target.x(), y: e.target.y() });
  };

  const handleBlur = () => {
    setText(inputValue);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && transformerRef.current && textRef.current) {
      transformerRef.current.nodes([textRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isEditing]);

  const handleTransformEnd = () => {
    const node = textRef.current;
    const scaleX = node.scaleX();

    node.setAttrs({
      scaleX: 1,
      fontSize: node.fontSize() * scaleX,
    });
  };

  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value));
  };

  const handleFontChange = (e) => {
    setFontFamily(e.target.value);
  };

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
  };

  const handleBorderColorChange = (e) => {
    setBorderColor(e.target.value);
  };

  return (
    <div className="canvas-container">
      <div className="stage-wrapper">
        <Stage width={1024} height={1024} ref={stageRef}>
          <Layer>
            {image && <Image image={image} width={800} height={800} />}
            {!isEditing && (
              <>
                <Text
                  ref={textRef}
                  text={text}
                  x={textPosition.x}
                  y={textPosition.y}
                  draggable
                  fill={textColor}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  stroke={borderColor}
                  strokeWidth={1}
                  onClick={handleTextClick}
                  onDragEnd={handleTextDragEnd}
                  onTransformEnd={handleTransformEnd}
                />
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    newBox.width = Math.max(30, newBox.width);
                    return newBox;
                  }}
                  enabledAnchors={["middle-left", "middle-right"]}
                />
              </>
            )}
          </Layer>
        </Stage>
      </div>
      {isEditing && (
        <textarea
          value={inputValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          style={{
            position: "absolute",
            top: `${textPosition.y}px`,
            left: `${textPosition.x}px`,
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            color: textColor,
            borderColor: borderColor,
            borderStyle: "solid",
            background: "none",
            borderWidth: "1px",
            padding: "4px",
            outline: "none",
            resize: "none",
          }}
        />
      )}
      <div className="controls-container">
        <div className="font-size-control">
          <label htmlFor="fontSize">텍스트 크기 (px):</label>
          <input
            type="number"
            id="fontSize"
            value={fontSize}
            min="10"
            max="100"
            step="5"
            onChange={handleFontSizeChange}
          />
        </div>
        <div className="font-control">
          <label htmlFor="font">폰트 선택:</label>
          <select id="font" value={fontFamily} onChange={handleFontChange}>
            <option value="Cafe24Dangdanghae">Cafe24Dangdanghae</option>
            <option value="Cafe24Ohsquare">Cafe24Ohsquare</option>
            <option value="Cafe24Simplehae">Cafe24Simplehae</option>
            <option value="NanumBarunGothic">NanumBarunGothic</option>
            <option value="NanumBrush">NanumBrush</option>
            <option value="NanumMyeongjoExtraBold">NanumMyeongjoExtraBold</option>
            <option value="NanumSquareRoundEB">NanumSquareRoundEB</option>
          </select>
        </div>
        <div className="color-control">
          <label htmlFor="textColor">텍스트 색상:</label>
          <input type="color" id="textColor" value={textColor} onChange={handleTextColorChange} />
        </div>
        <div className="border-color-control">
          <label htmlFor="borderColor">테두리 색상:</label>
          <input type="color" id="borderColor" value={borderColor} onChange={handleBorderColorChange} />
        </div>
        <button onClick={handleExport} className="canvas-button">Save Image</button>
        <button onClick={() => window.location.reload()} className="canvas-button">Reset</button>
      </div>
    </div>
  );
};

export default EditableCanvas;