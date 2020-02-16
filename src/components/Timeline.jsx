import React, { useRef, useEffect } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import styled from 'styled-components';
import moment from 'moment';
import { graphql, useStaticQuery } from 'gatsby';

import 'vis-timeline/styles/vis-timeline-graph2d.css';

const StyledTimeline = styled.div`
  width: 100%;
  height: 100%;
  .person {
    display: flex;
    img {
      margin: 0 16px 0 0;
    }
  }
`;

const formatDate = year => `${Math.abs(year)} b. C.`;

const parseItems = items =>
  new DataSet(
    items.map((x, idx) => ({
      id: idx,
      content: `<div class="person">
      <img src="${x.node.image.childImageSharp.original.src}" height="50"/>
<h4>${x.node.name}</h4>
    </person>`,
      start: moment().year(x.node.birth.year),
      end: moment().year(x.node.death.year),
    }))
  );

export default () => {
  const data = useStaticQuery(graphql`
    query {
      allPhilosophersYaml(sort: { fields: birth___year, order: DESC }) {
        edges {
          node {
            name
            image {
              childImageSharp {
                original {
                  src
                }
              }
            }
            id
            birth {
              year
            }
            death {
              year
            }
          }
        }
      }
    }
  `);
  const ref = useRef();
  useEffect(() => {
    new Timeline(ref.current, parseItems(data.allPhilosophersYaml.edges), {});
  }, []);
  return <StyledTimeline ref={ref} />;
};
