import styled from 'styled-components';

export const PrefectureItem = styled.div`
  padding-bottom: ${(props) => props.theme.spacing.default};
`;

export const PrefectureItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${(props) => props.theme.spacing.sm};
  align-items: center;
  h4 {
    font-weight: 400;
  }
`;
