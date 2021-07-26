import React, { useState } from "react";
import styled from "styled-components/macro";
import { rgba } from "polished";
import { NavLink, Redirect, withRouter } from "react-router-dom";
import { darken } from "polished";
import PerfectScrollbar from "react-perfect-scrollbar";
import "../vendor/perfect-scrollbar.css";
import axios from "../axios";

import { spacing } from "@material-ui/system";

import {
  Badge,
  Box as MuiBox,
  Chip,
  Grid,
  Avatar,
  Collapse,
  Drawer as MuiDrawer,
  List as MuiList,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";

import { ExpandLess, ExpandMore } from "@material-ui/icons";

import { green } from "@material-ui/core/colors";

import { sidebarRoutes as routes } from "../routes/index";

import { ReactComponent as Logo } from "../vendor/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../actions";

import logo from "../assets/images/trkar_logo_white.svg";

const Box = styled(MuiBox)(spacing);

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`;

const Scrollbar = styled(PerfectScrollbar)`
  background-color: ${(props) => props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const List = styled(MuiList)`
  background-color: ${(props) => props.theme.sidebar.background};
`;

const Items = styled.div`
  padding-top: ${(props) => props.theme.spacing(2.5)}px;
  padding-bottom: ${(props) => props.theme.spacing(2.5)}px;
`;

const Brand = styled(ListItem)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) => props.theme.sidebar.header.background};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)}px;
  padding-right: ${(props) => props.theme.spacing(6)}px;
  justify-content: flex-start;
  cursor: pointer;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }

  &:hover {
    background-color: ${(props) => props.theme.sidebar.header.background};
  }
`;

const BrandIcon = styled(Logo)`
  margin-right: ${(props) => props.theme.spacing(2)}px;
  color: ${(props) => props.theme.sidebar.header.brand.color};
  fill: ${(props) => props.theme.sidebar.header.brand.color};
  width: 32px;
  height: 32px;
`;

const BrandChip = styled(Chip)`
  background-color: ${green[700]};
  border-radius: 5px;
  color: ${(props) => props.theme.palette.common.white};
  font-size: 55%;
  height: 18px;
  margin-left: 2px;
  margin-top: -16px;
  padding: 3px 0;

  span {
    padding-left: ${(props) => props.theme.spacing(1.375)}px;
    padding-right: ${(props) => props.theme.spacing(1.375)}px;
  }
`;

const Category = styled(ListItem)`
  padding-top: ${(props) => props.theme.spacing(3)}px;
  padding-bottom: ${(props) => props.theme.spacing(3)}px;
  padding-left: ${(props) => props.theme.spacing(8)}px;
  padding-right: ${(props) => props.theme.spacing(7)}px;
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};

  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  &.${(props) => props.activeClassName} {
    background-color: ${(props) => "#424242"};
    // darken(0.03, props.theme.sidebar.background)};

    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`;

const CategoryText = styled(ListItemText)`
  margin: 0;
  span {
    color: ${(props) => props.theme.sidebar.color};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    padding: 0 ${(props) => props.theme.spacing(4)}px;
  }
`;

const CategoryIconLess = styled(ExpandLess)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const CategoryIconMore = styled(ExpandMore)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const Link = styled(ListItem)`
  padding-left: ${(props) => props.theme.spacing(17.5)}px;
  padding-top: ${(props) => props.theme.spacing(2)}px;
  padding-bottom: ${(props) => props.theme.spacing(2)}px;

  span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.7)};
  }

  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    margin-right: 15px;
  }

  &:hover span {
    color: ${(props) => rgba(props.theme.sidebar.color, 0.9)};
  }

  &:hover {
    background-color: ${(props) =>
      darken(0.015, props.theme.sidebar.background)};
  }

  &.${(props) => props.activeClassName} {
    background-color: ${
      "#424242"
      // (props) =>
      // darken(0.03, props.theme.sidebar.background)
    };

    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`;

const LinkText = styled(ListItemText)`
  color: ${(props) => props.theme.sidebar.color};
  span {
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
  }
  margin-top: 0;
  margin-bottom: 0;
`;

const LinkBadge = styled(Chip)`
  font-size: 11px;
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 28px;
  top: 8px;
  background: ${(props) => props.theme.sidebar.badge.background};

  span.MuiChip-label,
  span.MuiChip-label:hover {
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)}px;
    padding-right: ${(props) => props.theme.spacing(2)}px;
  }
`;

const CategoryBadge = styled(LinkBadge)`
  top: 12px;
`;

const SidebarSection = styled(Typography)`
  color: ${(props) => props.theme.sidebar.color};
  padding: ${(props) => props.theme.spacing(4)}px
    ${(props) => props.theme.spacing(7)}px
    ${(props) => props.theme.spacing(1)}px;
  opacity: 0.9;
  display: block;
`;

const SidebarFooter = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)}px
    ${(props) => props.theme.spacing(4)}px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const SidebarFooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
`;

const SidebarFooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  font-size: 0.7rem;
  display: block;
  padding: 1px;
`;

const SidebarFooterBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  span {
    background-color: ${(props) =>
      props.theme.sidebar.footer.online.background};
    border: 1.5px solid ${(props) => props.theme.palette.common.white};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`;

const SidebarCategory = ({
  name,
  icon,
  classes,
  isOpen,
  isCollapsable,
  badge,
  ...rest
}) => {
  return (
    <Category {...rest}>
      {icon}
      <CategoryText>{name}</CategoryText>
      {isCollapsable ? (
        isOpen ? (
          <CategoryIconMore />
        ) : (
          <CategoryIconLess />
        )
      ) : null}
      {badge ? <CategoryBadge label={badge} /> : ""}
    </Category>
  );
};

const SidebarLink = ({ name, to, badge, icon, id }) => {
  return (
    <Link
      button
      dense
      component={NavLink}
      // exact
      to={to}
      activeClassName="active"
      id={id}
    >
      {icon}
      <LinkText>{name}</LinkText>
      {badge ? <LinkBadge label={badge} /> : ""}
    </Link>
  );
};

const Sidebar = ({ classes, staticContext, location, ...rest }) => {
  const { user, userPermissions } = useSelector((state) => state);
  const dispatch = useDispatch();

  const initOpenRoutes = () => {
    /* Open collapse element that matches current url */
    const pathName = location.pathname;

    let _routes = {};

    routes.forEach((route, index) => {
      const isActive = pathName.indexOf(route.path) === 0;
      // const isActive = route.path.startsWith(pathName);
      const isOpen = route.open;
      const isHome = route.containsHome && pathName === "/";

      _routes = Object.assign({}, _routes, {
        [index]: isActive || isOpen || isHome,
      });
    });

    return _routes;
  };

  const [openRoutes, setOpenRoutes] = useState(() => initOpenRoutes());

  const toggle = (index) => {
    // Collapse all elements
    Object.keys(openRoutes).forEach(
      (item) =>
        openRoutes[index] ||
        setOpenRoutes((openRoutes) =>
          Object.assign({}, openRoutes, { [item]: false })
        )
    );

    // Toggle selected element
    setOpenRoutes((openRoutes) =>
      Object.assign({}, openRoutes, { [index]: !openRoutes[index] })
    );
  };

  const handleLogout = () => {
    axios
      .post("/logout", null)
      .then(async (res) => {
        await dispatch(Logout());
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("trkar-token");
        <Redirect to="/sign-in" />;
      })
      .catch((err) => {
        alert("Failed to Logout, please try again.");
      });
  };

  return (
    <Drawer variant="permanent" {...rest}>
      <Brand component={NavLink} to="/" button>
        {/* <BrandIcon />{" "} */}
        <img src={logo} alt="" srcset="" style={{ width: "100px" }} />
        {/* <Box ml={1}>
          TRKAR <BrandChip label="PRO" />
        </Box> */}
      </Brand>
      <SidebarFooter>
        <Grid container spacing={2}>
          <Grid item>
            <SidebarFooterBadge
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt={user?.name} src="" />
            </SidebarFooterBadge>
          </Grid>
          <Grid item>
            <b>
              <SidebarFooterText variant="username">
                {user?.name}
              </SidebarFooterText>
            </b>
            <SidebarFooterSubText variant="caption">
              {user?.email}
            </SidebarFooterSubText>
          </Grid>
        </Grid>
      </SidebarFooter>

      <Scrollbar>
        <List disablePadding>
          <Items>
            {routes.map((category, index) => (
              <React.Fragment key={index}>
                {category.header ? (
                  <SidebarSection>{category.header}</SidebarSection>
                ) : null}

                {category.children &&
                category.icon &&
                userPermissions?.includes(category.permission) ? (
                  <React.Fragment key={index}>
                    <SidebarCategory
                      isOpen={!openRoutes[index]}
                      isCollapsable={true}
                      id={category.id}
                      name={category.id}
                      icon={category.icon}
                      button={true}
                      onClick={() => toggle(index)}
                    />

                    <Collapse
                      in={openRoutes[index]}
                      timeout="auto"
                      unmountOnExit
                    >
                      {category.children.map((route, index) =>
                        userPermissions?.includes(route.permission) ? (
                          <SidebarLink
                            key={index}
                            id={route.name}
                            name={route.name}
                            to={route.path}
                            icon={route.icon}
                            // badge={route.badge}
                          />
                        ) : null
                      )}
                    </Collapse>
                  </React.Fragment>
                ) : category.icon &&
                  !category.children &&
                  (category.noPermissionRequired ||
                    userPermissions?.includes(category.permission)) &&
                  user?.roles[0].title !== "Staff" &&
                  category.id !== "Logout" ? (
                  <SidebarCategory
                    isCollapsable={false}
                    id={category.id}
                    name={category.id}
                    to={category.path}
                    activeClassName="active"
                    component={NavLink}
                    icon={category.icon}
                    exact={category.containsHome ? true : false}
                    //To make tabs other than the home page to track navigation of it's inner tabs
                    button
                    // badge={category.badge}
                  />
                ) : (user?.roles[0].title === "Staff" &&
                    category.id === "Dashboard") ||
                  (user?.roles[0].title === "Staff" &&
                    category.id === "Branches") ? (
                  <SidebarCategory
                    isCollapsable={false}
                    id={category.id}
                    name={category.id}
                    to={category.path}
                    activeClassName="active"
                    component={NavLink}
                    icon={category.icon}
                    exact={category.containsHome ? true : false}
                    //To make tabs other than the home page to track navigation of it's inner tabs
                    button
                    // badge={category.badge}
                  />
                ) : category.id == "Logout" ? (
                  <SidebarCategory
                    isCollapsable={false}
                    id={category.id}
                    name={category.id}
                    activeClassName="active"
                    icon={category.icon}
                    button
                    // badge={category.badge}
                    onClick={handleLogout}
                  />
                ) : null}
              </React.Fragment>
            ))}
          </Items>
        </List>
      </Scrollbar>
    </Drawer>
  );
};

export default withRouter(Sidebar);
