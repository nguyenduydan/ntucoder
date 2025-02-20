import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
import { useLocation } from 'react-router-dom';
import routes from 'routes';

export default function AdminNavbar(props) {
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();
	useEffect(() => {
		window.addEventListener('scroll', changeNavbar);

		return () => {
			window.removeEventListener('scroll', changeNavbar);
		};
	});

	const { secondary, message } = props;
	let currentItem;
	let currentCategory;
	// Tìm kiếm trong mảng `routes` để tìm route hiện tại dựa trên đường dẫn URL
	const currentRoute = routes.find(route => {
		// Kiểm tra nếu `location.pathname` (đường dẫn URL hiện tại) bắt đầu bằng `route.layout`
		// và có chứa phần đầu của `route.path` (loại bỏ tham số động như :id)
		if (location.pathname.startsWith(route.layout) && location.pathname.includes(route.path.split('/:')[0])) {

			// Tìm kiếm trong mảng `route.item` (các sub-routes) để xác định item con hiện tại
			currentItem = route.item?.find(item => {
				// Lấy phần đầu của `item.path`, loại bỏ các tham số động như :id
				const itemPath = item.path.split('/:')[0];

				// Kiểm tra nếu `location.pathname` chứa phần đường dẫn `itemPath`
				return location.pathname.includes(itemPath);
			});

			// Nếu route hiện tại phù hợp, trả về `true` để dừng tìm kiếm
			return true;
		}

		// Nếu không tìm thấy route phù hợp, tiếp tục tìm kiếm trong các route khác
		return false;
	});


	const brandText = currentItem ? currentItem.name : currentRoute ? currentRoute.name : 'Dashboard';

	// Màu sắc cho navbar và các phần khác
	let mainText = useColorModeValue('navy.700', 'white');
	let secondaryText = useColorModeValue('gray.700', 'white');
	let navbarPosition = 'fixed';
	let navbarFilter = 'none';
	let navbarBackdrop = 'blur(20px)';
	let navbarShadow = 'none';
	let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
	let navbarBorder = 'transparent';
	let secondaryMargin = '0px';
	let paddingX = '15px';
	let gap = '0px';

	const changeNavbar = () => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	};

	return (
		<Box
			position={navbarPosition}
			boxShadow={navbarShadow}
			bg={navbarBg}
			borderColor={navbarBorder}
			filter={navbarFilter}
			backdropFilter={navbarBackdrop}
			backgroundPosition='center'
			backgroundSize='cover'
			borderRadius='16px'
			borderWidth='1.5px'
			borderStyle='solid'
			transitionDelay='0s, 0s, 0s, 0s'
			transitionDuration=' 0.25s, 0.25s, 0.25s, 0s'
			transition-property='box-shadow, background-color, filter, border'
			transitionTimingFunction='linear, linear, linear, linear'
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH='75px'
			justifyContent={{ xl: 'center' }}
			lineHeight='25.6px'
			mx='auto'
			mt={secondaryMargin}
			pb='8px'
			right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
			px={{
				sm: paddingX,
				md: '10px'
			}}
			ps={{
				xl: '12px'
			}}
			pt='8px'
			top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
			w={{
				base: 'calc(100vw - 6%)',
				md: 'calc(100vw - 8%)',
				lg: 'calc(100vw - 6%)',
				xl: 'calc(100vw - 350px)',
				'2xl': 'calc(100vw - 365px)'
			}}
			zIndex={2}
		>
			<Flex
				w='100%'
				flexDirection={{
					sm: 'column',
					md: 'row'
				}}
				alignItems={{ xl: 'center' }}
				mb={gap}>
				<Box mb={{ sm: '8px', md: '0px' }}>
					<Breadcrumb>
						<BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
							<BreadcrumbLink href="#" color={secondaryText}>
								Admin
							</BreadcrumbLink>
						</BreadcrumbItem>

						{currentRoute && (
							<BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
								<BreadcrumbLink href={`${currentRoute.layout}${currentRoute.path}`} color={secondaryText}>
									{currentRoute.name}
								</BreadcrumbLink>
							</BreadcrumbItem>
						)}

						{currentCategory && (
							<BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
								<BreadcrumbLink href="#" color={secondaryText}>
									{currentCategory.name}
								</BreadcrumbLink>
							</BreadcrumbItem>
						)}

						{currentItem && (
							<BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
								<BreadcrumbLink href="#" color={secondaryText}>
									{currentItem.name}
								</BreadcrumbLink>
							</BreadcrumbItem>
						)}
					</Breadcrumb>

					{/* Hiển thị navbar brand */}
					<Link
						color={mainText}
						href='#'
						bg='inherit'
						borderRadius='inherit'
						fontWeight='bold'
						fontSize='34px'
						_hover={{ color: { mainText } }}
						_active={{
							bg: 'inherit',
							transform: 'none',
							borderColor: 'transparent'
						}}
						_focus={{
							boxShadow: 'none'
						}}>
						{brandText}
					</Link>
				</Box>
				<Box ms='auto' w={{ sm: '100%', md: 'unset' }}>
					<AdminNavbarLinks
						onOpen={props.onOpen}
						logoText={props.logoText}
						secondary={props.secondary}
						fixed={props.fixed}
						scrolled={scrolled}
					/>
				</Box>
			</Flex>
			{secondary ? <Text color='white'>{message}</Text> : null}
		</Box>
	);
}

AdminNavbar.propTypes = {
	brandText: PropTypes.string,
	variant: PropTypes.string,
	secondary: PropTypes.bool,
	fixed: PropTypes.bool,
	onOpen: PropTypes.func
};
