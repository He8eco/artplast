import "./listSections.css";
import React, { useState, useEffect } from "react";
import { db } from "../../index.js";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SectionsList = ({ className }) => {
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const navigate = useNavigate();

  const subscribeToCollection = (collectionName, setState, options = {}) => {
    const collectionQuery = query(
      collection(db, collectionName),
      ...(options.orderBy ? [orderBy(options.orderBy)] : [])
    );

    return onSnapshot(collectionQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setState(data);
      localStorage.setItem(
        `cached${
          collectionName.charAt(0).toUpperCase() + collectionName.slice(1)
        }`,
        JSON.stringify(data)
      );
    });
  };

  useEffect(() => {
    const unsubscribeSections = subscribeToCollection("sections", setSections, {
      orderBy: "position",
    });
    const unsubscribeCategories = subscribeToCollection(
      "categories",
      setCategories
    );

    return () => {
      unsubscribeSections();
      unsubscribeCategories();
    };
  }, []);

  const getCategoriesBySection = (sectionId) => {
    return categories.filter((category) => category.sectionId === sectionId);
  };

  const handleMouseEnter = (sectionId) => {
    clearTimeout(hoverTimeout);
    const timer = setTimeout(() => {
      setHoveredSection(sectionId);
    }, 300);
    setHoverTimeout(timer);
  };

  const handleContainerMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setHoveredSection(null);
  };

  const handleCategoryClick = (categoryName, sectionName) => {
    navigate(`/${sectionName}/${categoryName}`);
  };

  return (
    <div
      className={`listSections ${className}`}
      onMouseLeave={handleContainerMouseLeave}
    >
      <ul>
        {sections.map((section) => (
          <li
            key={section.id}
            className={`section ${
              hoveredSection === section.id ? "active-section" : ""
            }`}
            onMouseEnter={() => handleMouseEnter(section.id)}
          >
            {section.name}
            {hoveredSection === section.id && (
              <ul className="dropdown">
                {getCategoriesBySection(section.id).map((category) => (
                  <li
                    key={category.id}
                    className="categorie"
                    onClick={() =>
                      handleCategoryClick(category.name, section.name)
                    }
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionsList;
