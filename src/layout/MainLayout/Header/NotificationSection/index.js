import {
  useEffect,
  useRef
  // useState
} from 'react';
// import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  // Avatar,
  Box
  // Button,
  // CardActions,
  // Chip,
  // ClickAwayListener,
  // Divider,
  // Grid,
  // Paper,
  // Popper,
  // Stack,
  // TextField,
  // Typography,
  // useMediaQuery
} from '@mui/material';
import useKeyCloakAuth from '../../../../hooks/useKeyCloakAuth';

// third-party
// import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
// import MainCard from 'ui-component/cards/MainCard';
// import Transitions from 'ui-component/extended/Transitions';
// import NotificationList from './NotificationList';

// assets
// import { IconBell } from '@tabler/icons';

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const user = useKeyCloakAuth();
  // const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  // const [open, setOpen] = useState(false);
  // const [value, setValue] = useState('');
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  // const handleToggle = () => {
  //   setOpen((prevOpen) => !prevOpen);
  // };

  // const handleClose = (event) => {
  //   if (anchorRef.current && anchorRef.current.contains(event.target)) {
  //     return;
  //   }
  //   setOpen(false);
  // };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // const handleChange = (event) => setValue(event?.target.value);

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        {user?.name}
      </Box>
    </>
  );
};

export default NotificationSection;
